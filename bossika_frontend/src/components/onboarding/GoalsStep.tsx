import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { onboardingService } from '@/services/onboarding.service';
import type { BusinessGoals } from '@/types';

const goalsSchema = z.object({
  primary_goal: z.string().min(1, 'Please select a primary goal'),
  target_revenue: z.number().optional(),
  target_profit: z.number().optional(),
  time_frame: z.string().optional(),
  additional_goals: z.array(z.string()).optional(),
});

type GoalsForm = z.infer<typeof goalsSchema>;

const PRIMARY_GOALS = [
  'Increase Revenue',
  'Improve Cash Flow',
  'Reduce Expenses',
  'Expand Business',
  'Get Credit',
];

const ADDITIONAL_GOALS = [
  'Better Financial Planning',
  'Track Expenses',
  'Invoice Management',
  'Tax Planning',
  'Build Credit Score',
];

interface GoalsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function GoalsStep({ onNext, onBack }: GoalsStepProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GoalsForm>({
    resolver: zodResolver(goalsSchema),
    defaultValues: {
      primary_goal: '',
      target_revenue: undefined,
      target_profit: undefined,
      time_frame: '',
      additional_goals: [],
    },
  });

  const onSubmit = async (data: GoalsForm) => {
    setIsLoading(true);
    setError('');

    try {
      await onboardingService.saveBusinessGoals(data as BusinessGoals);
      onNext();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save goals');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Business Goals</CardTitle>
          <CardDescription>
            What are your main financial goals?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="primary_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Goal *</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        {...field}
                      >
                        <option value="">Select your primary goal</option>
                        {PRIMARY_GOALS.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Monthly Revenue (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_profit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Monthly Profit (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="time_frame"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Frame (Optional)</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        {...field}
                      >
                        <option value="">Select time frame</option>
                        <option value="3_months">3 Months</option>
                        <option value="6_months">6 Months</option>
                        <option value="1_year">1 Year</option>
                        <option value="2_years">2 Years</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additional_goals"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Additional Goals (Optional)</FormLabel>
                      <FormDescription>
                        Select any additional goals you'd like to achieve
                      </FormDescription>
                    </div>
                    {ADDITIONAL_GOALS.map((goal) => (
                      <FormField
                        key={goal}
                        control={form.control}
                        name="additional_goals"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={goal}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(goal)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), goal])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== goal)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {goal}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  Back
                </Button>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Skip for now
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Continue'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
