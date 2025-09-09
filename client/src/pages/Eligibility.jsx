import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calculator, CheckCircle, AlertTriangle } from "lucide-react";
import { calculateEligibility } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const Eligibility = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    monthlyObligations: "",
    roi: "",
    tenureMonths: "",
    loanAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [endpointAvailable, setEndpointAvailable] = useState(true);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    const { monthlyIncome, monthlyObligations, roi, tenureMonths } = formData;
    
    if (!monthlyIncome || !monthlyObligations || !roi || !tenureMonths) {
      toast({
        title: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const requestData = {
        monthly_income: parseFloat(monthlyIncome),
        monthly_obligations: parseFloat(monthlyObligations),
        roi: parseFloat(roi),
        tenure_months: parseInt(tenureMonths),
      };

      if (formData.loanAmount) {
        requestData.loan_amount = parseFloat(formData.loanAmount);
      }

      const response = await calculateEligibility(requestData);
      setResults(response);
      
      toast({
        title: "Eligibility calculation completed!",
        description: "Your loan eligibility has been calculated.",
      });
    } catch (error) {
      if (error.message.includes('404')) {
        setEndpointAvailable(false);
        toast({
          title: "Endpoint not found",
          description: "Check backend routes or update API prefix.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Calculation failed",
          description: error.message,
          variant: "destructive",
        });
      }
      console.error("Eligibility calculation error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!endpointAvailable) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Loan Eligibility Calculator</h2>
          <p className="text-muted-foreground">Calculate your loan eligibility based on financial parameters</p>
        </div>

        <Card className="rounded-2xl shadow-lg card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Service Unavailable</h3>
                <p className="text-muted-foreground mb-4">
                  The eligibility calculation service is currently unavailable.
                </p>
                <p className="text-sm text-muted-foreground">
                  Please enable the eligibility endpoint on the backend or contact your administrator.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Loan Eligibility Calculator</h2>
        <p className="text-muted-foreground">Calculate your loan eligibility based on financial parameters</p>
      </div>

      {/* Calculator Form */}
      <Card className="rounded-2xl shadow-lg card-hover">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            Financial Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="monthly-income" className="block text-sm font-medium text-foreground mb-2">
                Monthly Income ($)
              </Label>
              <Input
                id="monthly-income"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                placeholder="8,500"
                className="input-focus"
                data-testid="input-monthly-income"
              />
            </div>
            
            <div>
              <Label htmlFor="monthly-obligations" className="block text-sm font-medium text-foreground mb-2">
                Monthly Obligations ($)
              </Label>
              <Input
                id="monthly-obligations"
                type="number"
                value={formData.monthlyObligations}
                onChange={(e) => handleInputChange('monthlyObligations', e.target.value)}
                placeholder="1,200"
                className="input-focus"
                data-testid="input-monthly-obligations"
              />
            </div>
            
            <div>
              <Label htmlFor="interest-rate" className="block text-sm font-medium text-foreground mb-2">
                Interest Rate (% p.a.)
              </Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                value={formData.roi}
                onChange={(e) => handleInputChange('roi', e.target.value)}
                placeholder="7.25"
                className="input-focus"
                data-testid="input-interest-rate"
              />
            </div>
            
            <div>
              <Label htmlFor="tenure-months" className="block text-sm font-medium text-foreground mb-2">
                Tenure (Months)
              </Label>
              <Input
                id="tenure-months"
                type="number"
                value={formData.tenureMonths}
                onChange={(e) => handleInputChange('tenureMonths', e.target.value)}
                placeholder="360"
                className="input-focus"
                data-testid="input-tenure-months"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="loan-amount" className="block text-sm font-medium text-foreground mb-2">
                Desired Loan Amount ($) <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="loan-amount"
                type="number"
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                placeholder="450,000"
                className="input-focus"
                data-testid="input-loan-amount"
              />
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={loading}
            className="button-primary w-full sm:w-auto mt-6"
            data-testid="button-calculate"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Calculating...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Eligibility
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card className="rounded-2xl shadow-lg card-hover animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Eligibility Results
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-1">Monthly EMI</div>
                <div className="text-3xl font-bold text-blue-700" data-testid="text-emi">
                  ${results.emi ? results.emi.toLocaleString() : 'N/A'}
                </div>
                <div className="text-xs text-blue-600 mt-1">Principal + Interest</div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-sm text-green-600 font-medium mb-1">FOIR Ratio</div>
                <div className="text-3xl font-bold text-green-700" data-testid="text-foir">
                  {results.foir ? `${results.foir.toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-green-600 mt-1">Fixed Obligations to Income</div>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-1">Eligible Loan Amount</div>
                <div className="text-3xl font-bold text-purple-700" data-testid="text-eligible-amount">
                  ${results.eligible_loan_amount ? results.eligible_loan_amount.toLocaleString() : 'N/A'}
                </div>
                <div className="text-xs text-purple-600 mt-1">Maximum approved amount</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-700">
                  <strong>Note:</strong> This is an indicative calculation. Final approval depends on additional factors including credit score, employment stability, and property valuation.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Eligibility;
