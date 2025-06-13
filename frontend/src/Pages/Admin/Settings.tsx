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
  FiFileText,
  FiSend,
} from 'react-icons/fi';
import SelectComponent from '../../components/SelectComponent';
import {CrudField} from '../../components/CrudManager.tsx';
import RichTextEditor from '../../components/contracts/RichTextEditor.tsx';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: SettingsField[];
  customComponent?: React.ReactNode;
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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  description?: string;
  variables?: string[];
}

interface EmailTemplatesState {
  templates: EmailTemplate[];
  selectedTemplate: EmailTemplate | null;
  isEditing: boolean;
  isSending: boolean;
  testEmailAddress: string;
  showTemplateEditor: boolean;
}

const EmailTemplateEditor = ({
  template,
  onSave,
  onCancel,
  onSendTest,
}: {
  template: EmailTemplate;
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
  onSendTest: (template: EmailTemplate, email: string) => void|Promise<boolean>;
}) => {
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(template);
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSave = () => {
    onSave(editedTemplate);
  };

  const handleSendTest = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }
    setIsSending(true);
    try {
      await onSendTest(editedTemplate, testEmail);
      alert('Test email sent successfully!');
    } catch (error) {
      alert('Failed to send test email: ' + (error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Email Template</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Template
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Template Name</label>
          <Input
            type="text"
            value={editedTemplate.name}
            onChange={(e) => setEditedTemplate({...editedTemplate, name: e.target.value})}
            placeholder="e.g., Welcome Email, Invoice Receipt"
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Line</label>
          <Input
            type="text"
            value={editedTemplate.subject}
            onChange={(e) => setEditedTemplate({...editedTemplate, subject: e.target.value})}
            placeholder="e.g., Welcome to Our Service!"
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Content</label>
          <div className="border border-gray-300 rounded-md">
            <RichTextEditor
              text={editedTemplate.content}
              setText={(content) => setEditedTemplate({...editedTemplate, content})}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Available variables: {editedTemplate.variables?.join(', ') || 'None'}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Send Test Email</h4>
          <div className="flex space-x-2">
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address"
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="md"
              onClick={handleSendTest}
              isLoading={isSending}
              leftIcon={<FiSend className="w-4 h-4" />}
            >
              Send Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailTemplatesSection = () => {
  const [emailTemplatesState, setEmailTemplatesState] = useState<EmailTemplatesState>({
    templates: [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to Our Service!',
        content: '<p>Hello {{name}},</p><p>Welcome to our service! We\'re excited to have you on board.</p><p>Best regards,<br>The Team</p>',
        variables: ['name', 'company'],
      },
      {
        id: '2',
        name: 'Invoice Receipt',
        subject: 'Your Invoice #{{invoice_number}}',
        content: '<p>Hello {{name}},</p><p>Your invoice #{{invoice_number}} for {{amount}} has been processed.</p><p>Thank you for your business!</p>',
        variables: ['name', 'invoice_number', 'amount', 'due_date'],
      },
      {
        id: '3',
        name: 'Task Update',
        subject: 'Task Update: {{task_name}}',
        content: '<p>Hello {{name}},</p><p>The status of your task "{{task_name}}" has been updated to {{task_status}}.</p><p>Regards,<br>Project Management Team</p>',
        variables: ['name', 'task_name', 'task_status', 'task_description'],
      },
    ],
    selectedTemplate: null,
    isEditing: false,
    isSending: false,
    testEmailAddress: '',
    showTemplateEditor: false,
  });

  const handleSelectTemplate = (template: EmailTemplate) => {
    setEmailTemplatesState({
      ...emailTemplatesState,
      selectedTemplate: template,
      showTemplateEditor: true,
    });
  };

  const handleCreateTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `template_${Date.now()}`,
      name: 'New Template',
      subject: '',
      content: '',
      variables: ['name', 'company'],
    };

    setEmailTemplatesState({
      ...emailTemplatesState,
      selectedTemplate: newTemplate,
      showTemplateEditor: true,
    });
  };

  const handleSaveTemplate = (template: EmailTemplate) => {
    const isNew = !emailTemplatesState.templates.find(t => t.id === template.id);

    setEmailTemplatesState(prev => {
      const updatedTemplates = isNew
        ? [...prev.templates, template]
        : prev.templates.map(t => t.id === template.id ? template : t);

      return {
        ...prev,
        templates: updatedTemplates,
        selectedTemplate: null,
        showTemplateEditor: false,
      };
    });

    // Here you would typically save to the backend
    // api.saveEmailTemplate(template).then(...);
  };

  const handleCancelEdit = () => {
    setEmailTemplatesState({
      ...emailTemplatesState,
      selectedTemplate: null,
      showTemplateEditor: false,
    });
  };

  const handleSendTestEmail = async (template: EmailTemplate, email: string) => {
    // This would be an API call in a real implementation
    console.log(`Sending test email to ${email} using template ${template.name}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return success
    return true;
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setEmailTemplatesState(prev => ({
        ...prev,
        templates: prev.templates.filter(t => t.id !== templateId),
      }));

      // Here you would typically delete from the backend
      // api.deleteEmailTemplate(templateId).then(...);
    }
  };

  const handleCopyTemplate = (template: EmailTemplate) => {
    if (navigator.clipboard && window.ClipboardItem) {
      // Create HTML clipboard item
      const htmlBlob = new Blob([template.content], { type: 'text/html' });
      const item = new window.ClipboardItem({ 'text/html': htmlBlob });

      navigator.clipboard.write([item])
        .then(() => {
          alert(`Template "${template.name}" content copied as rich HTML!`);
        })
        .catch(err => {
          console.error('Failed to copy HTML content: ', err);
          alert('Failed to copy HTML content. See console for details.');
        });
    } else {
      // fallback: plain text only
      navigator.clipboard.writeText(template.content)
        .then(() => {
          alert(`Template "${template.name}" content copied as plain text.`);
        })
        .catch(err => {
          console.error('Failed to copy plain text: ', err);
          alert('Failed to copy template content. See console for details.');
        });
    }
  };

  if (emailTemplatesState.showTemplateEditor && emailTemplatesState.selectedTemplate) {
    return (
      <EmailTemplateEditor
        template={emailTemplatesState.selectedTemplate}
        onSave={handleSaveTemplate}
        onCancel={handleCancelEdit}
        onSendTest={handleSendTestEmail}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Templates</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={handleCreateTemplate}
          leftIcon={<FiFileText className="w-4 h-4" />}
        >
          Create Template
        </Button>
      </div>

      <div className="grid gap-4">
        {emailTemplatesState.templates.map(template => (
          <Card key={template.id} variant="outlined" className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{template.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <CardDescription>Subject: {template.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 line-clamp-2"
                   dangerouslySetInnerHTML={{ __html: template.content }} />
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <div className="text-xs text-gray-500">
                  Variables: {template.variables?.join(', ') || 'None'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyTemplate(template)}
                >
                  Copy Template
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState('company');

  // Initialize settings from API data
  useEffect(() => {
    if (settingsData?.length && !isLoading) {
      setSettings(settingsData[0]);
    }
  }, [settingsData, isLoading]);

  // Define settings sections
  const settingsSections: SettingsSection[] = [
    {
      id: 'company',
      title: 'Company Settings',
      description: 'Basic company information and branding',
      icon: <FiSettings className="w-5 h-5" />,
      fields: [
        {
          key: 'company_name',
          label: 'Company Name',
          type: 'text',
          placeholder: 'Your Company Name',
          helperText: 'The name of your organization',
        },
        {
          key: 'company_logo',
          label: 'Company Logo',
          type: 'text',
          placeholder: '/images/logo.png',
          helperText: 'Path to your company logo image',
        },
        {
          key: 'company_address',
          label: 'Company Address',
          type: 'textarea',
          placeholder: 'Enter your company address',
          helperText: 'Used for invoices and official documents',
        },
        {
          key: 'company_phone',
          label: 'Company Phone',
          type: 'text',
          placeholder: '+1 (555) 123-4567',
          helperText: 'Main contact number',
        },
        {
          key: 'company_email',
          label: 'Company Email',
          type: 'email',
          placeholder: 'info@yourcompany.com',
          helperText: 'Main contact email',
          validation: (value) =>
            !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              ? null
              : 'Please enter a valid email address',
        },
        {
          key: 'tax_id',
          label: 'Tax ID / VAT Number',
          type: 'text',
          placeholder: 'Enter your tax ID',
          helperText: 'Used for financial documents',
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
        {
          key: 'enable_email_templates',
          label: 'Enable Email Templates',
          type: 'toggle',
          helperText: 'Use predefined email templates for common communications',
        },
      ],
    },
    {
      id: 'email_templates',
      title: 'Email Templates',
      description: 'Manage HTML email templates for business communications',
      icon: <FiFileText className="w-5 h-5" />,
      fields: [],
      customComponent: <EmailTemplatesSection />,
    },
    {
      id: 'localization',
      title: 'Localization',
      description: 'Language and regional settings',
      icon: <FiGlobe className="w-5 h-5" />,
      fields: [
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
        {
          key: 'number_format',
          label: 'Number Format',
          type: 'select',
          options: [
            {value: '1,234.56', label: '1,234.56 (US)'},
            {value: '1.234,56', label: '1.234,56 (EU)'},
          ],
          helperText: 'Format for displaying numbers',
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
        {
          key: 'enable_webhook_integration',
          label: 'Enable Webhook Integration',
          type: 'toggle',
          helperText: 'Allow external systems to receive event notifications',
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
    const hasError = !!errors[field.key];

    switch (field.type) {
      case 'select':
        return (
          <div className="transition-all duration-200">
            <SelectComponent
              column={field as CrudField}
              filters={{
                [field.key]: value as string,
              }}
              handleFilterChange={(key, value) => handleChange(key, value || '')}
              defaultLabel={field.placeholder || `Select ${field.label}`}
            />
            {hasError && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                <FiAlertCircle className="w-4 h-4" />
                <span>{errors[field.key]}</span>
              </p>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div className="transition-all duration-200">
            <textarea
              className={`w-full rounded-md border ${hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-600' : 'border-zinc-300 focus:ring-blue-500 focus:border-blue-500'}
                bg-white text-zinc-900 p-4 min-h-[120px]
                transition-all duration-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2
                focus:ring-offset-1 shadow-sm hover:border-zinc-400`}
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
            {hasError && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                <FiAlertCircle className="w-4 h-4" />
                <span>{errors[field.key]}</span>
              </p>
            )}
          </div>
        );
      case 'toggle':
        return (
          <div className="flex items-center space-x-3 transition-all duration-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value === true || value === 'true' || value === 1 || value === '1'}
                onChange={(e) => handleChange(field.key, e.target.checked)}
              />
              <div className="w-14 h-7 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
                rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all
                peer-checked:bg-blue-600 shadow-inner"></div>
            </label>
            <span className="text-sm text-zinc-600">
              {value === true || value === 'true' || value === 1 || value === '1' ? 'Enabled' : 'Disabled'}
            </span>
            {hasError && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                <FiAlertCircle className="w-4 h-4" />
                <span>{errors[field.key]}</span>
              </p>
            )}
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
            size="lg"
            fullWidth
            className="shadow-sm hover:border-zinc-400 transition-all duration-200"
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
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <H2>Settings</H2>
            <Typography variant="muted">Manage application settings and configurations</Typography>
          </div>
          <Button
            variant="gradient"
            size="md"
            rounded="md"
            elevated
            onClick={saveSettings}
            isLoading={isSaving}
            leftIcon={<FiSave className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-lg flex items-center shadow-sm transition-all duration-300 animate-fadeIn">
            <FiCheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Global error message */}
        {errors.global && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg flex items-center shadow-sm transition-all duration-300 animate-fadeIn">
            <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="font-medium">{errors.global}</span>
          </div>
        )}

        {/* Settings tabs and content */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Tabs */}
          <div className="w-full md:w-60 flex-shrink-0">
            <Card variant="elevated" isHoverable>
              <CardHeader bordered compact>
                <CardTitle size="sm">Settings Categories</CardTitle>
                <CardDescription>Configure different aspects of your application</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-zinc-200">
                  {settingsSections.map((section) => (
                    <li key={section.id}>
                      <button
                        className={`w-full px-3 py-2.5 flex items-center gap-2 text-left transition-all duration-200 ${
                          activeTab === section.id
                            ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-600'
                            : 'hover:bg-zinc-50 hover:border-l-4 hover:border-zinc-300'
                        }`}
                        onClick={() => setActiveTab(section.id)}
                      >
                        <span className="text-base">{section.icon}</span>
                        <span className="font-medium text-sm">{section.title}</span>
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
                <Card key={section.id} variant="elevated" className="transition-all duration-300 animate-fadeIn">
                  <CardHeader bordered>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        {section.icon}
                      </div>
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {section.customComponent ? (
                      // Render custom component if it exists
                      section.customComponent
                    ) : (
                      // Otherwise render the standard fields
                      <div className="space-y-8">
                        {section.fields.map((field) => (
                          <div key={field.key} className="space-y-2 transition-all duration-200 hover:translate-x-1">
                            <label className="block text-sm font-semibold text-zinc-800">
                              {field.label}
                              {field.key.includes('mail') && field.key !== 'mail_driver' && (
                                <span className="ml-2 text-xs text-zinc-500 font-normal">
                                  ({field.type === 'email' ? 'Email' : 'Text'})
                                </span>
                              )}
                            </label>
                            {renderField(field)}
                            {field.helperText && !errors[field.key] && (
                              <p className="text-xs text-zinc-500 mt-1">{field.helperText}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter bordered className="bg-zinc-50 py-4">
                    <div className="flex justify-between items-center w-full">
                      <Typography variant="muted" className="text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                      </Typography>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={saveSettings}
                        isLoading={isSaving}
                        leftIcon={<FiSave className="w-4 h-4" />}
                      >
                        Save {section.title}
                      </Button>
                    </div>
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
