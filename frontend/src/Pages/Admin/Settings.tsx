import {useEffect, useState} from 'react';
import {useApi} from '../../hooks/useApi.ts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../components/ui';
import {Input} from '../../components/ui';
import {Button} from '../../components/ui';
import {Typography, H2} from '../../components/ui';
import {
  FiSave,
  FiSettings,
  FiMail,
  FiGlobe,
  FiServer,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import SelectComponent from '../../components/SelectComponent';
import {CrudField} from '../../components/CrudManager.tsx';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: SettingsField[];
}

interface SettingsField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'toggle';
  placeholder?: string;
  helperText?: string;
  options?: {value: string; label: string}[];
  validation?: (value: any) => string | null;
}

const Settings = () => {
  const {
    data: settingsData,
    isLoading,
    updateMutation,
  } = useApi('settings');

  const [settings, setSettings] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Initialize settings from API data
  useEffect(() => {
    if (settingsData && !isLoading) {
      setSettings(settingsData);
    }
  }, [settingsData, isLoading]);

  // Define settings sections
  const settingsSections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General Settings',
      description: 'Basic application settings and configurations',
      icon: <FiSettings className="w-5 h-5" />,
      fields: [
        {
          key: 'site_name',
          label: 'Site Name',
          type: 'text',
          placeholder: 'My Application',
          helperText: 'The name of your application',
        },
        {
          key: 'site_description',
          label: 'Site Description',
          type: 'textarea',
          placeholder: 'A brief description of your application',
          helperText: 'Used in meta tags and for SEO',
        },
        {
          key: 'timezone',
          label: 'Default Timezone',
          type: 'select',
          options: [
            {value: 'UTC', label: 'UTC'},
            {value: 'America/New_York', label: 'Eastern Time (ET)'},
            {value: 'America/Chicago', label: 'Central Time (CT)'},
            {value: 'America/Denver', label: 'Mountain Time (MT)'},
            {value: 'America/Los_Angeles', label: 'Pacific Time (PT)'},
            {value: 'Europe/London', label: 'Greenwich Mean Time (GMT)'},
            {value: 'Europe/Paris', label: 'Central European Time (CET)'},
          ],
        },
        {
          key: 'date_format',
          label: 'Date Format',
          type: 'select',
          options: [
            {value: 'MM/DD/YYYY', label: 'MM/DD/YYYY'},
            {value: 'DD/MM/YYYY', label: 'DD/MM/YYYY'},
            {value: 'YYYY-MM-DD', label: 'YYYY-MM-DD'},
          ],
        },
      ],
    },
    {
      id: 'email',
      title: 'Email Settings',
      description: 'Configure email server and notification settings',
      icon: <FiMail className="w-5 h-5" />,
      fields: [
        {
          key: 'mail_from_address',
          label: 'From Address',
          type: 'email',
          placeholder: 'noreply@example.com',
          validation: (value) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              ? null
              : 'Please enter a valid email address',
        },
        {
          key: 'mail_from_name',
          label: 'From Name',
          type: 'text',
          placeholder: 'My Application',
        },
        {
          key: 'mail_driver',
          label: 'Mail Driver',
          type: 'select',
          options: [
            {value: 'smtp', label: 'SMTP'},
            {value: 'sendmail', label: 'Sendmail'},
            {value: 'mailgun', label: 'Mailgun'},
            {value: 'ses', label: 'Amazon SES'},
          ],
        },
        {
          key: 'mail_host',
          label: 'SMTP Host',
          type: 'text',
          placeholder: 'smtp.example.com',
        },
        {
          key: 'mail_port',
          label: 'SMTP Port',
          type: 'number',
          placeholder: '587',
        },
      ],
    },
    {
      id: 'api',
      title: 'API Settings',
      description: 'Configure API access and rate limiting',
      icon: <FiServer className="w-5 h-5" />,
      fields: [
        {
          key: 'api_rate_limit',
          label: 'Rate Limit (requests per minute)',
          type: 'number',
          placeholder: '60',
        },
        {
          key: 'api_token_expiration',
          label: 'Token Expiration (days)',
          type: 'number',
          placeholder: '30',
        },
        {
          key: 'api_debug_mode',
          label: 'Debug Mode',
          type: 'toggle',
        },
      ],
    },
    {
      id: 'localization',
      title: 'Localization',
      description: 'Language and regional settings',
      icon: <FiGlobe className="w-5 h-5" />,
      fields: [
        {
          key: 'default_language',
          label: 'Default Language',
          type: 'select',
          options: [
            {value: 'en', label: 'English'},
            {value: 'es', label: 'Spanish'},
            {value: 'fr', label: 'French'},
            {value: 'de', label: 'German'},
            {value: 'it', label: 'Italian'},
            {value: 'pt', label: 'Portuguese'},
            {value: 'ru', label: 'Russian'},
            {value: 'zh', label: 'Chinese'},
          ],
        },
        {
          key: 'default_currency',
          label: 'Default Currency',
          type: 'select',
          options: [
            {value: 'USD', label: 'US Dollar (USD)'},
            {value: 'EUR', label: 'Euro (EUR)'},
            {value: 'GBP', label: 'British Pound (GBP)'},
            {value: 'JPY', label: 'Japanese Yen (JPY)'},
            {value: 'CAD', label: 'Canadian Dollar (CAD)'},
            {value: 'AUD', label: 'Australian Dollar (AUD)'},
          ],
        },
      ],
    },
  ];

  // Handle input changes
  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Clear error for this field if it exists
    if (errors[key]) {
      setErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[key];
        return newErrors;
      });
    }

    // Clear success message when user starts editing
    if (success) {
      setSuccess(null);
    }
  };

  // Validate all fields
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate all fields in all sections
    settingsSections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.validation) {
          const error = field.validation(settings[field.key]);
          if (error) {
            newErrors[field.key] = error;
            isValid = false;
          }
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  // Save settings
  const saveSettings = async () => {
    // Validate fields first
    if (!validateFields()) {
      return;
    }

    setIsSaving(true);
    setSuccess(null);

    try {
      await updateMutation.mutateAsync(settings as Record<string, any> & { id: number; });
      setSuccess('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);

      // Check if the error is related to insufficient permissions
      if (error instanceof Error && error.message.includes('Unauthorized: Insufficient permissions')) {
        setErrors({
          global: 'You do not have sufficient permissions to modify these settings. Please contact an administrator.',
        });
      } else {
        setErrors({
          global: 'Failed to save settings. Please try again.',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Render field based on type
  const renderField = (field: SettingsField) => {
    const value = settings[field.key] || '';

    switch (field.type) {
      case 'select':
        return (
          <SelectComponent
            column={field as CrudField}
            filters={{
              [field.key]: value as string,
            }}
            handleFilterChange={(key, value) => handleChange(key, value || '')}
            defaultLabel={field.placeholder || `Select ${field.label}`}
          />
        );
      case 'textarea':
        return (
          <textarea
            className="w-full rounded-md border border-zinc-300 bg-white text-zinc-900 p-3 min-h-[100px]
              transition-all duration-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        );
      case 'toggle':
        return (
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value === true || value === 'true' || value === 1 || value === '1'}
                onChange={(e) => handleChange(field.key, e.target.checked)}
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                peer-checked:bg-blue-600"></div>
            </label>
          </div>
        );
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            error={errors[field.key]}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <H2>Settings</H2>
            <Typography variant="muted">Manage application settings and configurations</Typography>
          </div>
          <Button
            variant="primary"
            onClick={saveSettings}
            isLoading={isSaving}
            leftIcon={<FiSave className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <FiCheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Global error message */}
        {errors.global && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2" />
            {errors.global}
          </div>
        )}

        {/* Settings tabs and content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-zinc-200">
                  {settingsSections.map((section) => (
                    <li key={section.id}>
                      <button
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                          activeTab === section.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'hover:bg-zinc-50'
                        }`}
                        onClick={() => setActiveTab(section.id)}
                      >
                        {section.icon}
                        <span>{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            {settingsSections
              .filter((section) => section.id === activeTab)
              .map((section) => (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {section.fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="block text-sm font-medium text-zinc-700">
                            {field.label}
                          </label>
                          {renderField(field)}
                          {field.helperText && !errors[field.key] && (
                            <p className="text-xs text-zinc-500">{field.helperText}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-zinc-200 bg-zinc-50">
                    <Button
                      variant="primary"
                      onClick={saveSettings}
                      isLoading={isSaving}
                      leftIcon={<FiSave className="w-4 h-4" />}
                    >
                      Save {section.title}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
