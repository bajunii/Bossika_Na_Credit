import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
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
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, Trash2 } from 'lucide-react';
import { onboardingService } from '@/services/onboarding.service';
import type { IncomeExpenseSetup } from '@/types';

const expenseCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
});

const incomeExpenseSchema = z.object({
  monthly_income: z.number().min(0, 'Income must be positive').optional(),
  income_sources: z.array(z.string()).optional(),
  monthly_expenses: z.number().min(0, 'Expenses must be positive').optional(),
  expense_categories: z.array(expenseCategorySchema).optional(),
});

type IncomeExpenseForm = z.infer<typeof incomeExpenseSchema>;

interface IncomeExpenseStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function IncomeExpenseStep({ onComplete, onBack }: IncomeExpenseStepProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IncomeExpenseForm>({
    resolver: zodResolver(incomeExpenseSchema),
    defaultValues: {
      monthly_income: undefined,
      income_sources: [],
      monthly_expenses: undefined,
      expense_categories: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'expense_categories',
  });

  const onSubmit = async (data: IncomeExpenseForm) => {
    setIsLoading(true);
    setError('');

    try {
      await onboardingService.saveIncomeExpenseSetup(data as IncomeExpenseSetup);
      await onboardingService.completeOnboarding();
      onComplete();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Income & Expenses</CardTitle>
          <CardDescription>
            Help us understand your business finances
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Income Information</h3>
                
                <FormField
                  control={form.control}
                  name="monthly_income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Monthly Income (Optional)</FormLabel>
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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Expense Information</h3>
                
                <FormField
                  control={form.control}
                  name="monthly_expenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Monthly Expenses (Optional)</FormLabel>
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

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Expense Categories</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({ name: '', amount: 0, frequency: 'monthly' })
                      }
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <FormField
                          control={form.control}
                          name={`expense_categories.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Rent" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`expense_categories.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name={`expense_categories.${index}.frequency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <FormControl>
                                <select
                                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                                  {...field}
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

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
                    {isLoading ? 'Completing...' : 'Complete Setup'}
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
