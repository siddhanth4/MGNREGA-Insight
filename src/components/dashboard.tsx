'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BrainCircuit, IndianRupee, MapPin, Users } from 'lucide-react';

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
        // Set default selection
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

    // A mock function to suggest a district based on location.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
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
      color: 'hsl(var(--chart-1))',
    },
    fundsUtilized: {
      label: 'Funds Utilized (Rs. Lakhs)',
      color: 'hsl(var(--chart-2))',
    },
  };
  
  const comparisonChartConfig: ChartConfig = {
    personDays: {
      label: "Person-Days",
      color: "hsl(var(--chart-2))",
    },
  };

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {locationSuggestion && !isLoading && (
         <Alert>
           <MapPin className="h-4 w-4" />
           <AlertTitle>Location Suggestion</AlertTitle>
           <AlertDescription className="flex items-center justify-between">
             We think you're in {locationSuggestion}. Would you like to see data for this district?
             <div className="space-x-2">
                <Button onClick={handleUseSuggestion} size="sm">Yes, use {locationSuggestion}</Button>
                <Button onClick={() => setLocationSuggestion(null)} size="sm" variant="outline">No, thanks</Button>
             </div>
           </AlertDescription>
         </Alert>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">State</label>
          <Select onValueChange={handleStateChange} value={selectedState?.name}>
            <SelectTrigger>
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
        <div>
          <label className="text-sm font-medium">District</label>
          <Select onValueChange={handleDistrictChange} value={selectedDistrict?.name} disabled={!selectedState}>
            <SelectTrigger>
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please select a state and district to view performance data.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Person-Days Generated</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performance?.totalPersonDays.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total for the last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Funds Utilized</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {performance?.totalFundsUtilized.toLocaleString()} L</div>
                <p className="text-xs text-muted-foreground">Total for the last year</p>              
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Daily Wage</CardTitle>
                 <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {performance?.averageWage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Compared to state average</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Works Completed</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performance?.worksCompleted.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total infrastructure projects</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
             <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
                <CardDescription>Person-days generated and funds utilized over the last 12 months.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="aspect-video h-[250px] w-full">
                  <LineChart data={performance?.historicalData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => (value as number / 1000) + 'k'}/>
                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(value) => `Rs. ${(value as number / 100)} L`}/>
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Line yAxisId="left" dataKey="personDays" type="monotone" stroke="var(--color-personDays)" strokeWidth={2} dot={false} name="Person-Days" />
                    <Line yAxisId="right" dataKey="fundsUtilized" type="monotone" stroke="var(--color-fundsUtilized)" strokeWidth={2} dot={false} name="Funds Utilized" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Comparative Analysis</CardTitle>
                <CardDescription>How {selectedDistrict.name} compares to other districts in {selectedState?.name}.</CardDescription>
              </Header>
              <CardContent>
                 <ChartContainer config={comparisonChartConfig} className="aspect-video h-[250px] w-full">
                    <BarChart data={comparisonData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => (value as number / 100000) + 'L'}/>
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="personDays" radius={4}>
                        {comparisonData.map((entry) => (
                           <Cell key={entry.name} fill={entry.isCurrent ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"} opacity={entry.isCurrent ? 1 : 0.4} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-6 w-6 text-primary" />
                AI-Powered Plain Language Summary
              </CardTitle>
              <CardDescription>An easy-to-understand summary of {selectedDistrict.name}'s performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAiLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : aiSummary ? (
                <p className="text-sm leading-relaxed">{aiSummary}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Click the button to generate an AI summary.</p>
              )}
              <Button onClick={handleGenerateSummary} disabled={isAiLoading}>
                {isAiLoading ? 'Generating...' : 'Generate Summary'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
