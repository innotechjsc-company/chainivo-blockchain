"use client";

import { useState } from "react";
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
} from "@/components";
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
} from "lucide-react";
import { InvestmentHero } from "@/components/investments/investmentHero/investmentHero";
import { UserDashboard } from "@/components/investments/UserDashboard/UserDashboard";

export default function InvestmentsPage() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header session={session} onSignOut={() => navigate("/auth")} /> */}
      <main className="flex-1">
        {/* Investment Hero with Charts & Metrics */}
        <InvestmentHero />

        {/* User Dashboard */}
        <UserDashboard />

        {/* Investment Phases */}
        {/* <InvestmentPhases /> */}

        {/* Transaction History */}
        {/* <section className="py-12 bg-gradient-to-br from-background to-background/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <TransactionHistory />
            </div>
          </div>
        </section> */}

        {/* Blockchain Stats */}
        {/* <BlockchainStats /> */}

        {/* Company & Token Info */}
        {/* <CompanyInfo /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
