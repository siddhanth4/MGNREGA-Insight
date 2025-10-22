'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BrainCircuit, Briefcase, IndianRupee, MapPin, Users, Wrench } from 'lucide-react';

import type { District, PerformanceData, State } from '@/lib/types';
import { getAiSummaryAction } from '@/lib/actions';
import { getMockMgnregaData } from '@/lib/api';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export default function Dashboard() {
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(true);
  const [locationSuggestion, setLocationSuggestion] = useState<string | null>(null);

  const [aiSummary, setAiSummary] = useState('');
  const [isAiLoading, startAiTransition] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = getMockMgnregaData();
        setStates(data);
        if (data.length > 0) {
          const defaultState = data.find(s => s.name === 'Maharashtra') || data[0];
          setSelectedState(defaultState);
          setDistricts(defaultState.districts);
          if (defaultState.districts.length > 0) {
            setSelectedDistrict(defaultState.districts[0]);
          }
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Failed to load data",
          description: "Could not fetch MGNREGA data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Mock suggestion for Pune, India
        if (latitude > 18.4 && latitude < 18.6 && longitude > 73.8 && longitude < 74.0) {
          setLocationSuggestion('Pune');
        }
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 5000 }
    );
  }, [toast]);
  
  const handleUseSuggestion = () => {
    if (locationSuggestion) {
      const state = states.find(s => s.districts.some(d => d.name === locationSuggestion));
      if (state) {
        handleStateChange(state.name);
        handleDistrictChange(locationSuggestion);
      }
    }
    setLocationSuggestion(null);
  };

  const handleStateChange = (stateName: string) => {
    const state = states.find((s) => s.name === stateName);
    if (state) {
      setSelectedState(state);
      setDistricts(state.districts);
      setSelectedDistrict(state.districts[0] || null);
      setAiSummary('');
    }
  };

  const handleDistrictChange = (districtName: string) => {
    const district = districts.find((d) => d.name === districtName);
    setSelectedDistrict(district || null);
    setAiSummary('');
  };

  const handleGenerateSummary = () => {
    if (!selectedDistrict || !selectedState) return;
    startAiTransition(async () => {
        try {
          const performanceData = selectedDistrict.performance;
          const summary = await getAiSummaryAction(
              selectedDistrict.name,
              selectedState.name,
              performanceData,
          );
          setAiSummary(summary);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to generate summary.',
            });
        }
    });
  };

  const performance = selectedDistrict?.performance;

  const comparisonData = useMemo(() => {
    if (!selectedState || !selectedDistrict) return [];
    return selectedState.districts.map((d) => ({
      name: d.name,
      personDays: d.performance.totalPersonDays,
      isCurrent: d.name === selectedDistrict.name,
    }));
  }, [selectedState, selectedDistrict]);

  const chartConfig: ChartConfig = {
    personDays: {
      label: 'Person-Days',
      color: 'hsl(var(--primary))',
    },
    fundsUtilized: {
      label: 'Funds Utilized (Rs. Lakhs)',
      color: 'hsl(var(--accent))',
    },
  };
  
  const comparisonChartConfig: ChartConfig = {
    personDays: {
      label: "Person-Days",
      color: "hsl(var(--primary))",
    },
  };

  if (isLoading) {
    return (
      <div className="grid animate-pulse gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {!isLocating && locationSuggestion && (
         <Alert className="bg-card shadow-md">
           <MapPin className="h-5 w-5 text-primary" />
           <AlertTitle className="font-bold">Location Suggestion</AlertTitle>
           <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <p>We think you're in {locationSuggestion}. Would you like to see data for this district?</p>
             <div className="flex-shrink-0 space-x-2">
                <Button onClick={handleUseSuggestion} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">Yes, use {locationSuggestion}</Button>
                <Button onClick={() => setLocationSuggestion(null)} size="sm" variant="outline">No, thanks</Button>
             </div>
           </AlertDescription>
         </Alert>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground/80">State</label>
          <Select onValueChange={handleStateChange} defaultValue={selectedState?.name}>
            <SelectTrigger className="h-12 rounded-lg text-base">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground/80">District</label>
          <Select onValueChange={handleDistrictChange} value={selectedDistrict?.name} disabled={!selectedState}>
            <SelectTrigger className="h-12 rounded-lg text-base">
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.name} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedDistrict ? (
        <Card className="rounded-xl shadow-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please select a state and district to view performance data.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold">Person-Days</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performance?.totalPersonDays.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total work days generated</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold">Funds Utilized</CardTitle>
                <IndianRupee className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Rs. {performance?.totalFundsUtilized.toLocaleString()} L</div>
                <p className="text-xs text-muted-foreground">Total funds spent</p>              
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold">Average Wage</CardTitle>
                 <IndianRupee className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Rs. {performance?.averageWage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Average daily wage paid</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-bold">Works Completed</CardTitle>
                <Briefcase className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{performance?.worksCompleted.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total projects finished</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
             <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="font-bold">Last 12 Months</CardTitle>
                <CardDescription>How performance has changed over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                  <LineChart data={performance?.historicalData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => (value as number / 1000) + 'k'}/>
                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(value) => `Rs. ${(value as number / 100)}L`}/>
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Line yAxisId="left" dataKey="personDays" type="monotone" stroke="var(--color-personDays)" strokeWidth={3} dot={{r: 4}} name="Person-Days" />
                    <Line yAxisId="right" dataKey="fundsUtilized" type="monotone" stroke="var(--color-fundsUtilized)" strokeWidth={3} dot={{r: 4}} name="Funds Utilized" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="font-bold">District Comparison</CardTitle>
                <CardDescription>How {selectedDistrict.name} compares to other districts in {selectedState?.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={comparisonChartConfig} className="aspect-video h-[250px] w-full">
                    <BarChart data={comparisonData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} tick={{ fontSize: 10 }} />
                      <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => (value as number / 100000) + 'L'}/>
                      <Tooltip cursor={{ fill: 'hsl(var(--background))' }} content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="personDays" radius={8}>
                        {comparisonData.map((entry) => (
                           <Cell key={entry.name} fill={entry.isCurrent ? "hsl(var(--primary))" : "hsl(var(--accent))"} opacity={entry.isCurrent ? 1 : 0.4} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold">
                <BrainCircuit className="h-6 w-6 text-primary" />
                AI-Powered Summary
              </CardTitle>
              <CardDescription>An easy-to-understand summary of {selectedDistrict.name}'s performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAiLoading ? (
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : aiSummary ? (
                <div className="prose prose-sm max-w-full text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br />') }} />
              ) : (
                <p className="text-sm text-muted-foreground pt-2">Click the button to get a simple summary of the data.</p>
              )}
              <Button onClick={handleGenerateSummary} disabled={isAiLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Wrench className="mr-2 h-4 w-4 animate-spin hidden" />
                {isAiLoading ? 'Generating...' : 'Generate Simple Summary'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
