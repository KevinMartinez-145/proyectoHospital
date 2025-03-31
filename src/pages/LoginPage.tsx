// src/pages/LoginPage.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react'; // Loading spinner icon

// --- Ensure correct import paths ---
// Adjust these paths based on YOUR folder structure
import { loginSchema, LoginFormData } from '@/schemas/authSchema'; // Zod schema and TS type for form
import { useLogin } from '@/hooks/useAuthMutations'; // The custom mutation hook we fixed
import type { LoginRequest } from '@/types/auth';    // Type for the API request payload

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

/**
 * LoginPage Component
 * Renders the login form and handles user authentication attempts.
 */
export function LoginPage() {
  // 1. Get the mutation function and its state from our custom hook
  const loginMutation = useLogin();

  // 2. Initialize React Hook Form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema), // Use Zod for validation
    defaultValues: {
      email: '',
      password: '',
      // Add default for 'rol' here if it's part of your loginSchema/LoginFormData
    },
  });

  // 3. Define the submit handler
  const onSubmit = (formData: LoginFormData) => {
    // This function is called by form.handleSubmit ONLY if validation passes


    // Trigger the mutation (API call) with the validated form data.
    // Type assertion might be needed if LoginFormData and LoginRequest differ slightly
    // (e.g., if LoginRequest has an optional 'rol' not present in the form).
    // If they are identical, `loginMutation.mutate(formData)` is fine.
    loginMutation.mutate(formData as LoginRequest);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Introduce tus credenciales para acceder al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 4. Setup Shadcn Form provider */}
          <Form {...form}>
            {/* 5. Use form.handleSubmit to trigger validation and our onSubmit */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control} // Connects to RHF state
                name="email"           // Must match a key in LoginFormData/loginSchema
                render={({ field }) => ( // 'field' contains { onChange, onBlur, value, name, ref }
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        autoComplete="email"
                        {...field} // Spread RHF props onto the input
                      />
                    </FormControl>
                    <FormMessage /> {/* Displays Zod validation errors for this field */}
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password" // Must match a key in LoginFormData/loginSchema
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="******"
                        autoComplete="current-password"
                        {...field} // Spread RHF props onto the input
                      />
                    </FormControl>
                    <FormMessage /> {/* Displays Zod validation errors for this field */}
                  </FormItem>
                )}
              />

              {/* Optional: Add Role selector FormField here if needed */}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending} // Disable button while mutation is running
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Optional: Display a general error message from the mutation state */}
              {/* {loginMutation.isError && (
                <p className="text-sm font-medium text-destructive text-center">
                  {loginMutation.error instanceof AxiosError
                    ? loginMutation.error.response?.data?.message || 'Error de conexión'
                    : 'Ocurrió un error inesperado'}
                </p>
              )} */}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}