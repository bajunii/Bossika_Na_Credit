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
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { onboardingService } from '@/services/onboarding.service';
import type { BusinessDetails } from '@/types';

const businessDetailsSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_type: z.string().min(1, 'Please select a business type'),
  industry: z.string().min(1, 'Please select an industry'),
  registration_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type BusinessDetailsForm = z.infer<typeof businessDetailsSchema>;

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Company',
  'Corporation',
  'Other',
];

const INDUSTRIES = [
  'Retail',
  'Services',
  'Manufacturing',
  'Technology',
  'Healthcare',
  'Education',
  'Food & Beverage',
  'Construction',
  'Other',
];

interface BusinessDetailsStepProps {
  onNext: () => void;
}

export default function BusinessDetailsStep({ onNext }: BusinessDetailsStepProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BusinessDetailsForm>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: {
      business_name: '',
      business_type: '',
      industry: '',
      registration_number: '',
      address: '',
      city: '',
      country: '',
    },
  });

  const onSubmit = async (data: BusinessDetailsForm) => {
    setIsLoading(true);
    setError('');

    try {
      await onboardingService.saveBusinessDetails(data as BusinessDetails);
      onNext();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save business details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Let's start by learning about your business
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
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type *</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        {...field}
                      >
                        <option value="">Select business type</option>
                        {BUSINESS_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry *</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-3 py-2 border border-input bg-background rounded-md"
                        {...field}
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter registration number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
