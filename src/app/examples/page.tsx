'use client'

import { useState } from 'react'
import {
  Button,
  IconButton,
  ButtonGroup,
  SocialButton,
  LoadingButton,
  CopyButton,
  TextInput,
  PasswordInput,
  NumberInput,
  SearchInput,
  TextareaInput,
  SelectInput,
  CheckboxInput,
  SwitchInput,
  RadioGroup,
} from '@/components'
import { 
  Mail, 
  User, 
  Settings, 
  Download, 
  Trash, 
  Edit, 
  Plus,
  DollarSign,
  Heart,
} from 'lucide-react'

export default function ComponentsExamplePage() {
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Examples & Demos</h1>
        <p className="text-muted-foreground">
          Comprehensive examples of components and API usage
        </p>
        
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <a href="/examples">Components Demo</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/examples/api-demo">API Demo</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/examples/zustand-demo">Zustand Demo</a>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-2">Components Library</h2>
        <p className="text-muted-foreground">
          Comprehensive button and input components built with shadcn/ui
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Buttons</h2>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Button Sizes</h3>
          <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Buttons with Icons</h3>
          <div className="flex flex-wrap gap-4">
            <Button icon={<Mail className="h-4 w-4" />}>Email</Button>
            <Button icon={<Download className="h-4 w-4" />} iconPosition="end">
              Download
            </Button>
            <Button loading loadingText="Processing...">
              Submit
            </Button>
            <Button fullWidth className="max-w-xs">Full Width</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Icon Buttons</h3>
          <div className="flex gap-4">
            <IconButton icon={<Settings className="h-4 w-4" />} aria-label="Settings" />
            <IconButton 
              icon={<Trash className="h-4 w-4" />} 
              variant="destructive" 
              aria-label="Delete" 
            />
            <IconButton 
              icon={<Edit className="h-4 w-4" />} 
              variant="outline" 
              aria-label="Edit" 
            />
            <IconButton 
              icon={<Plus className="h-4 w-4" />} 
              size="icon-lg" 
              aria-label="Add" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Button Groups</h3>
          <div className="space-y-4">
            <ButtonGroup attached>
              <Button>Left</Button>
              <Button>Middle</Button>
              <Button>Right</Button>
            </ButtonGroup>
            
            <ButtonGroup orientation="vertical" attached>
              <Button>Top</Button>
              <Button>Middle</Button>
              <Button>Bottom</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Social Buttons</h3>
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            <SocialButton platform="google" />
            <SocialButton platform="facebook" />
            <SocialButton platform="github" />
            <SocialButton platform="twitter" />
            <SocialButton platform="linkedin" />
            <SocialButton platform="instagram" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Special Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <LoadingButton 
              isLoading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 2000)
              }}
            >
              Submit Form
            </LoadingButton>
            <CopyButton textToCopy="npm install chainivo">
              Copy Command
            </CopyButton>
            <Button shadow gradient>
              Fancy Button
            </Button>
            <Button rounded="full">
              <Heart className="h-4 w-4 mr-2" />
              Like
            </Button>
          </div>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Inputs</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Text Inputs</h3>
            
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              helperText="We'll never share your email"
            />

            <TextInput
              label="Username"
              placeholder="Enter username"
              leftIcon={<User className="h-4 w-4" />}
              showClearButton
              required
            />

            <TextInput
              label="Error State"
              error="This field is required"
              placeholder="Invalid input"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">Password Input</h3>
            
            <PasswordInput
              label="Password"
              placeholder="Enter password"
              helperText="Must be at least 8 characters"
            />

            <PasswordInput
              label="Create Password"
              placeholder="Create strong password"
              showStrengthMeter
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Number Input</h3>
            
            <NumberInput
              label="Quantity"
              min={0}
              max={100}
              step={1}
              defaultValue="1"
            />

            <NumberInput
              label="Price"
              leftIcon={<DollarSign className="h-4 w-4" />}
              showStepper={false}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium">Search Input</h3>
            
            <SearchInput
              label="Search"
              placeholder="Search anything..."
              onSearch={(value) => console.log('Searching:', value)}
            />

            <SearchInput
              placeholder="Search with button..."
              showSearchButton
              clearable
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Textarea Input</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <TextareaInput
              label="Description"
              placeholder="Enter description..."
              rows={4}
              helperText="Provide a detailed description"
            />

            <TextareaInput
              label="Bio"
              placeholder="Tell us about yourself..."
              maxLength={500}
              showCharacterCount
              autoResize
              minRows={3}
              maxRows={8}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Select Input</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <SelectInput
              label="Country"
              placeholder="Select country"
              options={[
                { value: 'vn', label: 'Vietnam' },
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
                { value: 'jp', label: 'Japan' },
              ]}
            />

            <SelectInput
              label="Framework"
              placeholder="Choose framework"
              options={[
                { value: 'react', label: 'React', description: 'JavaScript library' },
                { value: 'vue', label: 'Vue', description: 'Progressive framework' },
                { value: 'angular', label: 'Angular', description: 'Platform & framework' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Checkbox & Switch</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <CheckboxInput
                label="Accept terms and conditions"
                helperText="You must accept to continue"
                required
              />
              <CheckboxInput
                label="Subscribe to newsletter"
                helperText="Receive weekly updates"
              />
              <CheckboxInput
                label="Enable two-factor authentication"
                checkboxPosition="right"
              />
            </div>

            <div className="space-y-4">
              <SwitchInput
                label="Enable notifications"
                helperText="Receive push notifications"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <SwitchInput
                label="Dark Mode"
                onLabel="On"
                offLabel="Off"
                switchPosition="right"
              />
              <SwitchInput
                label="Auto-save"
                helperText="Automatically save your work"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-medium">Radio Group</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <RadioGroup
              label="Choose a plan"
              name="plan"
              options={[
                { value: 'free', label: 'Free', description: '$0/month' },
                { value: 'pro', label: 'Pro', description: '$10/month' },
                { value: 'enterprise', label: 'Enterprise', description: '$50/month' },
              ]}
              value={selectedPlan}
              onValueChange={setSelectedPlan}
            />

            <RadioGroup
              label="Size"
              name="size"
              layout="horizontal"
              options={[
                { value: 's', label: 'Small' },
                { value: 'm', label: 'Medium' },
                { value: 'l', label: 'Large' },
                { value: 'xl', label: 'Extra Large' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Complete Form Example */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold">Complete Form Example</h2>
        
        <form className="max-w-2xl space-y-6 p-6 border rounded-lg">
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            required
            leftIcon={<User className="h-4 w-4" />}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            showStrengthMeter
            required
          />

          <SelectInput
            label="Country"
            placeholder="Select your country"
            required
            options={[
              { value: 'vn', label: 'Vietnam' },
              { value: 'us', label: 'United States' },
              { value: 'uk', label: 'United Kingdom' },
            ]}
          />

          <RadioGroup
            label="Subscription Plan"
            name="subscription"
            required
            options={[
              { value: 'free', label: 'Free Plan', description: 'Perfect for getting started' },
              { value: 'pro', label: 'Pro Plan', description: 'For professionals' },
              { value: 'enterprise', label: 'Enterprise', description: 'For large teams' },
            ]}
          />

          <TextareaInput
            label="Additional Notes"
            placeholder="Any additional information..."
            maxLength={500}
            showCharacterCount
            autoResize
          />

          <CheckboxInput
            label="I agree to the terms and conditions"
            required
          />

          <div className="flex gap-4">
            <Button type="submit" fullWidth>
              Submit
            </Button>
            <Button type="button" variant="outline" fullWidth>
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}

