import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for Loan Support RAG
  
  // Health check endpoint
  app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Ingest documents endpoint
  app.post("/api/v1/ingest", (req, res) => {
    try {
      const { path } = req.body;
      const documentPath = path || "app/data/documents";
      
      // Simulate document ingestion
      // In a real implementation, this would process PDFs from the specified path
      const mockResponse = {
        status: "ok",
        ingested: {
          pages: Math.floor(Math.random() * 200) + 50, // Random between 50-250
          chunks: Math.floor(Math.random() * 2000) + 500, // Random between 500-2500
        }
      };
      
      // Add delay to simulate processing
      setTimeout(() => {
        res.json(mockResponse);
      }, 1000);
      
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to ingest documents", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Chat/Ask endpoint
  app.post("/api/v1/chat/ask", (req, res) => {
    try {
      const { query, top_k } = req.body;
      
      if (!query) {
        return res.status(400).json({ 
          message: "Query is required" 
        });
      }
      
      // Simulate RAG response based on query
      // In a real implementation, this would query the vector database
      const mockAnswers = [
        `Based on the loan documentation requirements, here are the key eligibility criteria:

• **Minimum Credit Score**: 650 or higher for conventional loans
• **Debt-to-Income Ratio**: Should not exceed 43% of gross monthly income
• **Employment History**: Stable employment for at least 2 years
• **Down Payment**: Minimum 3.5% for FHA loans, 5-20% for conventional loans

**Required Documentation**:
• Recent pay stubs (last 2 months)
• Tax returns (last 2 years)
• Bank statements (last 3 months)
• Employment verification letter
• Credit report authorization

For pre-approval, ensure all documentation is current and accurately reflects your financial situation.`,

        `Loan processing typically follows these stages:

**1. Application & Pre-qualification**
• Submit initial application with basic financial information
• Receive pre-qualification letter within 1-3 business days

**2. Document Collection & Verification**
• Provide required documentation (typically takes 3-7 days)
• Underwriter reviews and verifies all information

**3. Property Appraisal & Final Approval**
• Property appraisal ordered (7-10 business days)
• Final underwriting decision within 2-5 business days

**4. Closing Process**
• Schedule closing appointment
• Final walkthrough and document signing

Total timeline: 30-45 days for most conventional loans.`,

        `Interest rates and loan terms vary based on several factors:

**Current Rate Environment**:
• Conventional loans: 6.5% - 8.5% APR
• FHA loans: 6.0% - 8.0% APR
• VA loans: 6.0% - 7.5% APR
• Jumbo loans: 7.0% - 9.0% APR

**Factors Affecting Your Rate**:
• Credit score (higher score = lower rate)
• Down payment amount (more down = better rate)
• Loan-to-value ratio
• Debt-to-income ratio
• Loan term (15-year vs 30-year)

**Rate Lock Options**:
• 30-day lock: No cost
• 60-day lock: 0.125% of loan amount
• 90-day lock: 0.25% of loan amount

Contact your loan officer for current rates specific to your situation.`
      ];
      
      const randomAnswer = mockAnswers[Math.floor(Math.random() * mockAnswers.length)];
      
      // Add delay to simulate processing
      setTimeout(() => {
        res.json({
          answer: randomAnswer
        });
      }, Math.floor(Math.random() * 1000) + 500); // Random delay 500-1500ms
      
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to process question", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Eligibility calculation endpoint
  app.post("/api/v1/eligibility/calculate", (req, res) => {
    try {
      const { 
        monthly_income, 
        monthly_obligations, 
        roi, 
        tenure_months, 
        loan_amount 
      } = req.body;
      
      if (!monthly_income || !monthly_obligations || !roi || !tenure_months) {
        return res.status(400).json({ 
          message: "Monthly income, monthly obligations, ROI, and tenure are required" 
        });
      }
      
      // Calculate EMI using the standard formula
      const monthlyRate = roi / 100 / 12;
      const numPayments = tenure_months;
      
      let emi;
      if (loan_amount) {
        // Calculate EMI for given loan amount
        emi = (loan_amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
              (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else {
        // Calculate maximum EMI based on income (assuming 40% FOIR)
        const maxEmi = (monthly_income * 0.4) - monthly_obligations;
        emi = maxEmi;
      }
      
      // Calculate FOIR
      const totalObligations = monthly_obligations + emi;
      const foir = (totalObligations / monthly_income) * 100;
      
      // Calculate eligible loan amount
      const maxAffordableEmi = (monthly_income * 0.43) - monthly_obligations; // 43% max FOIR
      const eligibleLoanAmount = (maxAffordableEmi * (Math.pow(1 + monthlyRate, numPayments) - 1)) / 
                                (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
      
      // Add delay to simulate processing
      setTimeout(() => {
        res.json({
          emi: Math.round(emi),
          foir: Math.round(foir * 10) / 10, // Round to 1 decimal
          eligible_loan_amount: Math.round(eligibleLoanAmount)
        });
      }, Math.floor(Math.random() * 1000) + 500); // Random delay 500-1500ms
      
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to calculate eligibility", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // API documentation endpoint (redirect to external docs)
  app.get("/api/v1/docs", (req, res) => {
    res.redirect("https://swagger.io/specification/");
  });

  // OpenAPI specification endpoint
  app.get("/api/v1/openapi.json", (req, res) => {
    const openApiSpec = {
      openapi: "3.0.0",
      info: {
        title: "Loan Support RAG API",
        version: "1.0.0",
        description: "API for document ingestion, RAG queries, and loan eligibility calculations"
      },
      servers: [
        {
          url: "/api/v1",
          description: "API v1"
        }
      ],
      paths: {
        "/health": {
          get: {
            summary: "Health check",
            responses: {
              "200": {
                description: "Service is healthy"
              }
            }
          }
        },
        "/ingest": {
          post: {
            summary: "Ingest PDF documents",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      path: {
                        type: "string",
                        default: "app/data/documents"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/chat/ask": {
          post: {
            summary: "Ask a question using RAG",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["query"],
                    properties: {
                      query: {
                        type: "string"
                      },
                      top_k: {
                        type: "integer",
                        default: 5
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/eligibility/calculate": {
          post: {
            summary: "Calculate loan eligibility",
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["monthly_income", "monthly_obligations", "roi", "tenure_months"],
                    properties: {
                      monthly_income: {
                        type: "number"
                      },
                      monthly_obligations: {
                        type: "number"
                      },
                      roi: {
                        type: "number"
                      },
                      tenure_months: {
                        type: "integer"
                      },
                      loan_amount: {
                        type: "number"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    
    res.json(openApiSpec);
  });

  const httpServer = createServer(app);
  return httpServer;
}
