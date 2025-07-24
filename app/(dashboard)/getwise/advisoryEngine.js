// advisoryEngine.js
/**
 * Rule-based financial advisory engine
 */

// Spending threshold percentages (of total income)
const THRESHOLDS = {
    CRITICAL: 0.9, // 90% of income
    HIGH: 0.7, // 70% of income
    MODERATE: 0.5, // 50% of income
    LOW: 0.3, // 30% of income
  };
  
  // Category spending guidelines (percentage of income)
  const CATEGORY_GUIDELINES = {
    Housing: { ideal: 0.3, high: 0.4 },
    Food: { ideal: 0.15, high: 0.25 },
    Transportation: { ideal: 0.1, high: 0.15 },
    Entertainment: { ideal: 0.05, high: 0.1 },
    Shopping: { ideal: 0.1, high: 0.2 },
    Utilities: { ideal: 0.08, high: 0.12 },
    Healthcare: { ideal: 0.05, high: 0.1 },
    Education: { ideal: 0.1, high: 0.15 },
    // Default values for any other category
    default: { ideal: 0.1, high: 0.15 },
  };
  
  // Income level classifications (in ₹)
  const INCOME_LEVELS = {
    LOW: 25000,
    MEDIUM: 50000,
    HIGH: 100000,
    VERY_HIGH: 200000,
  };
  
  // Investment suggestions based on income level and spending ratio
  const INVESTMENT_SUGGESTIONS = {
    LOW: {
      LOW_SPENDING: [
        "Consider starting a recurring deposit with ₹1,000-₹2,000 monthly",
        "Invest in a conservative mutual fund SIP of ₹500-₹1,000 monthly",
        "Open a PPF account with minimum contribution of ₹500 monthly"
      ],
      MODERATE_SPENDING: [
        "Set up an emergency fund with 3 months of expenses",
        "Consider investing ₹500 monthly in a low-risk mutual fund",
        "Look into government schemes like Sukanya Samriddhi or NSC"
      ],
      HIGH_SPENDING: [
        "Focus on reducing expenses before considering investments",
        "Start small with ₹100-₹500 monthly in a recurring deposit",
        "Consider microinvestment options with minimal contributions"
      ]
    },
    MEDIUM: {
      LOW_SPENDING: [
        "Invest ₹5,000-₹10,000 monthly in equity mutual funds via SIP",
        "Consider tax-saving ELSS funds to save up to ₹46,800 in taxes",
        "Allocate ₹2,000-₹3,000 monthly to debt funds for stability"
      ],
      MODERATE_SPENDING: [
        "Start an SIP of ₹3,000-₹5,000 in balanced mutual funds",
        "Consider NPS contribution of ₹2,000-₹4,000 monthly for retirement",
        "Invest in FDs or RDs with ₹2,000-₹5,000 monthly for short-term goals"
      ],
      HIGH_SPENDING: [
        "Reduce discretionary spending and start with ₹1,000-₹2,000 SIP",
        "Build an emergency fund before other investments",
        "Consider liquid funds for short-term parking of excess funds"
      ]
    },
    HIGH: {
      LOW_SPENDING: [
        "Diversify with ₹15,000-₹25,000 monthly in equity, ₹10,000 in debt funds",
        "Consider direct equity investments of ₹10,000-₹20,000 monthly",
        "Explore REITs with ₹5,000-₹10,000 monthly for real estate exposure"
      ],
      MODERATE_SPENDING: [
        "Allocate ₹10,000-₹15,000 monthly to multi-cap mutual funds",
        "Consider corporate bonds or debt funds with ₹5,000-₹10,000 monthly",
        "Invest in gold ETFs with ₹3,000-₹5,000 monthly for diversification"
      ],
      HIGH_SPENDING: [
        "Focus on expense reduction and allocate ₹5,000-₹10,000 to mutual funds",
        "Consider conservative hybrid funds with ₹5,000 monthly",
        "Build emergency corpus of 6 months' expenses before other investments"
      ]
    },
    VERY_HIGH: {
      LOW_SPENDING: [
        "Consider professional portfolio management with ₹50,000+ monthly allocation",
        "Diversify across equity (40%), debt (30%), real estate (20%), and alternatives (10%)",
        "Consider international equity exposure with ₹15,000-₹25,000 monthly"
      ],
      MODERATE_SPENDING: [
        "Allocate ₹25,000-₹40,000 monthly to a balanced portfolio",
        "Consider tax-free bonds and structured products for tax efficiency",
        "Explore alternative investments like P2P lending with ₹10,000-₹15,000 monthly"
      ],
      HIGH_SPENDING: [
        "Review and optimize spending patterns before increasing investments",
        "Allocate ₹15,000-₹25,000 monthly to a conservative portfolio",
        "Consider tax planning with ₹10,000-₹15,000 monthly in ELSS and NPS"
      ]
    }
  };
  
  // Expense reduction suggestions based on category
  const EXPENSE_REDUCTION_TIPS = {
    Housing: [
      "Consider renegotiating your rent or refinancing your home loan",
      "Look for a roommate to share housing costs",
      "Explore more affordable housing options if your rent exceeds 30% of income"
    ],
    Food: [
      "Plan meals in advance and prepare a shopping list to avoid impulse purchases",
      "Cook at home more often and limit eating out to special occasions",
      "Buy groceries in bulk and look for seasonal produce which is typically cheaper"
    ],
    Transportation: [
      "Consider using public transportation or carpooling to save on fuel costs",
      "Maintain your vehicle regularly to avoid costly repairs",
      "Compare insurance providers annually to ensure the best rates"
    ],
    Entertainment: [
      "Look for free or low-cost entertainment options in your area",
      "Consider sharing subscription services with family or friends",
      "Set a monthly entertainment budget and stick to it"
    ],
    Shopping: [
      "Distinguish between needs and wants before making purchases",
      "Wait 24-48 hours before making non-essential purchases",
      "Look for sales, discounts, or cashback offers"
    ],
    Utilities: [
      "Invest in energy-efficient appliances to reduce electricity bills",
      "Consider switching to a different service provider for better rates",
      "Reduce usage during peak hours when rates may be higher"
    ],
    Healthcare: [
      "Consider preventive care to avoid costly medical treatments",
      "Compare prices for medications and ask about generic alternatives",
      "Review your health insurance plan for the best coverage"
    ],
    Education: [
      "Look for scholarships, grants, or financial aid opportunities",
      "Consider online courses or community colleges for lower costs",
      "Invest in skills that can increase your earning potential"
    ],
    default: [
      "Track all expenses in this category to identify unnecessary spending",
      "Set a monthly budget limit for this category",
      "Look for more affordable alternatives or bulk purchase options"
    ]
  };
  
  /**
   * Generate general financial advice based on spending patterns
   * @param {Object} data - User's financial data
   * @returns {string} - Personalized financial advice
   */
  export function generateFinancialAdvice(data) {
    if (!data) return "Please provide your financial data to receive personalized advice.";
  
    const { incomeAmount, expensesAmount, remainingAmount, categories } = data;
    
    // Calculate spending ratio
    const spendingRatio = expensesAmount / incomeAmount;
    
    // Determine overall financial health
    let overallAdvice = "";
    let savingsTips = [];
    let categorySpecificAdvice = [];
    
    // Overall financial health assessment
    if (spendingRatio >= THRESHOLDS.CRITICAL) {
      overallAdvice = `Your spending is at a critical level (${(spendingRatio * 100).toFixed(1)}% of income). Immediate action is needed to reduce expenses and avoid debt.`;
      savingsTips = [
        "Implement a strict budget for all essential expenses",
        "Temporarily freeze all non-essential spending",
        "Consider additional income sources to boost your earnings",
        "Set up automatic transfers to savings right after receiving income"
      ];
    } else if (spendingRatio >= THRESHOLDS.HIGH) {
      overallAdvice = `Your spending is high (${(spendingRatio * 100).toFixed(1)}% of income). You should focus on reducing expenses to build savings.`;
      savingsTips = [
        "Aim to reduce monthly expenses by 15-20%",
        "Prioritize needs over wants in your spending decisions",
        "Build an emergency fund with at least 3 months of expenses",
        "Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings"
      ];
    } else if (spendingRatio >= THRESHOLDS.MODERATE) {
      overallAdvice = `Your spending is moderate (${(spendingRatio * 100).toFixed(1)}% of income). There's room to increase savings and investments.`;
      savingsTips = [
        "Increase your savings rate by 5-10%",
        "Consider setting up automatic transfers to investment accounts",
        "Build an emergency fund with 6 months of expenses",
        "Review and optimize your tax planning strategies"
      ];
    } else {
      overallAdvice = `Your spending is well-controlled (${(spendingRatio * 100).toFixed(1)}% of income). Focus on optimizing investments and long-term financial planning.`;
      savingsTips = [
        "Maximize tax-advantaged investment options",
        "Consider diversifying your investment portfolio",
        "Set specific financial goals for your savings",
        "Review insurance coverage to ensure adequate protection"
      ];
    }
    
    // Category-specific advice
    categories.forEach(category => {
      const categoryRatio = category.value / incomeAmount;
      const guidelines = CATEGORY_GUIDELINES[category.name] || CATEGORY_GUIDELINES.default;
      
      if (categoryRatio > guidelines.high) {
        const tips = EXPENSE_REDUCTION_TIPS[category.name] || EXPENSE_REDUCTION_TIPS.default;
        categorySpecificAdvice.push(`**${category.name}**: Your spending (₹${category.value}, ${(categoryRatio * 100).toFixed(1)}% of income) is significantly higher than recommended (${guidelines.high * 100}%). ${tips[0]}`);
      } else if (categoryRatio > guidelines.ideal) {
        const tips = EXPENSE_REDUCTION_TIPS[category.name] || EXPENSE_REDUCTION_TIPS.default;
        categorySpecificAdvice.push(`**${category.name}**: Your spending (₹${category.value}, ${(categoryRatio * 100).toFixed(1)}% of income) is slightly above the ideal range (${guidelines.ideal * 100}%). ${tips[1]}`);
      }
    });
    
    // Format the advice
    let adviceText = `## Financial Health Assessment\n\n${overallAdvice}\n\n`;
    
    if (savingsTips.length > 0) {
      adviceText += `## Savings Recommendations\n\n`;
      savingsTips.forEach(tip => {
        adviceText += `- ${tip}\n`;
      });
      adviceText += `\n`;
    }
    
    if (categorySpecificAdvice.length > 0) {
      adviceText += `## Category-Specific Recommendations\n\n`;
      categorySpecificAdvice.forEach(advice => {
        adviceText += `- ${advice}\n`;
      });
      adviceText += `\n`;
    }
    
    // Add monthly savings potential
    const savingsPotential = calculateSavingsPotential(data);
    if (savingsPotential > 0) {
      adviceText += `## Savings Potential\n\n`;
      adviceText += `Based on the analysis, you could potentially save an additional ₹${savingsPotential.toLocaleString()} per month by optimizing your spending patterns.\n\n`;
    }
    
    // Add budget allocation recommendation
    adviceText += `## Recommended Budget Allocation\n\n`;
    adviceText += `For your monthly income of ₹${incomeAmount.toLocaleString()}, consider the following allocation:\n\n`;
    adviceText += `- Essential expenses: ₹${Math.round(incomeAmount * 0.5).toLocaleString()} (50%)\n`;
    adviceText += `- Discretionary spending: ₹${Math.round(incomeAmount * 0.3).toLocaleString()} (30%)\n`;
    adviceText += `- Savings and investments: ₹${Math.round(incomeAmount * 0.2).toLocaleString()} (20%)\n`;
    
    return adviceText;
  }
  
  /**
   * Calculate potential monthly savings
   * @param {Object} data - User's financial data
   * @returns {number} - Potential monthly savings amount
   */
  function calculateSavingsPotential(data) {
    if (!data || !data.categories) return 0;
    
    const { incomeAmount, categories } = data;
    let potentialSavings = 0;
    
    categories.forEach(category => {
      const guidelines = CATEGORY_GUIDELINES[category.name] || CATEGORY_GUIDELINES.default;
      const currentSpending = category.value;
      const recommendedSpending = incomeAmount * guidelines.ideal;
      
      if (currentSpending > recommendedSpending) {
        potentialSavings += (currentSpending - recommendedSpending);
      }
    });
    
    return Math.round(potentialSavings);
  }
  
  /**
   * Generate investment advice based on financial data
   * @param {Object} data - User's financial data
   * @returns {string} - Personalized investment advice
   */
  export function generateInvestmentAdvice(data) {
    if (!data) return "Please provide your financial data to receive personalized investment advice.";
  
    const { incomeAmount, expensesAmount } = data;
    const spendingRatio = expensesAmount / incomeAmount;
    
    // Determine income level
    let incomeLevel = "LOW";
    if (incomeAmount >= INCOME_LEVELS.VERY_HIGH) {
      incomeLevel = "VERY_HIGH";
    } else if (incomeAmount >= INCOME_LEVELS.HIGH) {
      incomeLevel = "HIGH";
    } else if (incomeAmount >= INCOME_LEVELS.MEDIUM) {
      incomeLevel = "MEDIUM";
    }
    
    // Determine spending level
    let spendingLevel = "LOW_SPENDING";
    if (spendingRatio >= THRESHOLDS.HIGH) {
      spendingLevel = "HIGH_SPENDING";
    } else if (spendingRatio >= THRESHOLDS.MODERATE) {
      spendingLevel = "MODERATE_SPENDING";
    }
    
    // Get investment suggestions
    const suggestions = INVESTMENT_SUGGESTIONS[incomeLevel][spendingLevel];
    
    // Calculate investment amounts
    const recommendedInvestmentAmount = calculateRecommendedInvestment(incomeAmount, spendingRatio);
    
    // Create investment advice
    let adviceText = `## Investment Recommendations\n\n`;
    
    adviceText += `Based on your monthly income of ₹${incomeAmount.toLocaleString()} and spending ratio of ${(spendingRatio * 100).toFixed(1)}%, you should aim to invest approximately ₹${recommendedInvestmentAmount.toLocaleString()} monthly.\n\n`;
    
    adviceText += `### Recommended Investment Strategy\n\n`;
    suggestions.forEach(suggestion => {
      adviceText += `- ${suggestion}\n`;
    });
    
    // Add asset allocation recommendation
    adviceText += `\n### Suggested Asset Allocation\n\n`;
    
    // Adjust asset allocation based on spending ratio
    let equityPercentage, debtPercentage, liquidPercentage;
    
    if (spendingRatio >= THRESHOLDS.HIGH) {
      // Conservative allocation for high spenders
      equityPercentage = 30;
      debtPercentage = 40;
      liquidPercentage = 30;
    } else if (spendingRatio >= THRESHOLDS.MODERATE) {
      // Balanced allocation for moderate spenders
      equityPercentage = 50;
      debtPercentage = 30;
      liquidPercentage = 20;
    } else {
      // Growth allocation for low spenders
      equityPercentage = 70;
      debtPercentage = 20;
      liquidPercentage = 10;
    }
    
    adviceText += `- Equity: ₹${Math.round(recommendedInvestmentAmount * equityPercentage / 100).toLocaleString()} (${equityPercentage}%)\n`;
    adviceText += `- Debt: ₹${Math.round(recommendedInvestmentAmount * debtPercentage / 100).toLocaleString()} (${debtPercentage}%)\n`;
    adviceText += `- Liquid/Emergency Fund: ₹${Math.round(recommendedInvestmentAmount * liquidPercentage / 100).toLocaleString()} (${liquidPercentage}%)\n`;
    
    // Add tax saving suggestions
    adviceText += `\n### Tax Saving Recommendations\n\n`;
    adviceText += `- Section 80C (EPF, ELSS, etc.): Up to ₹1.5 lakh per annum\n`;
    adviceText += `- Section 80D (Health Insurance): Up to ₹25,000 per annum\n`;
    adviceText += `- Section 80G (Charitable Donations): Varies based on donation amount\n`;
    
    return adviceText;
  }
  
  /**
   * Calculate recommended monthly investment amount
   * @param {number} income - Monthly income
   * @param {number} spendingRatio - Ratio of expenses to income
   * @returns {number} - Recommended monthly investment amount
   */
  function calculateRecommendedInvestment(income, spendingRatio) {
    // Base recommendation is 20% of income
    let baseRecommendation = income * 0.2;
    
    // Adjust based on spending ratio
    if (spendingRatio >= THRESHOLDS.CRITICAL) {
      // If spending is critical, recommend minimum 5% of income
      return Math.round(income * 0.05);
    } else if (spendingRatio >= THRESHOLDS.HIGH) {
      // If spending is high, recommend 10% of income
      return Math.round(income * 0.1);
    } else if (spendingRatio >= THRESHOLDS.MODERATE) {
      // If spending is moderate, recommend 15% of income
      return Math.round(income * 0.15);
    } else {
      // If spending is low, recommend 20-30% of income
      return Math.round(income * (0.2 + (1 - spendingRatio) * 0.1));
    }
  }
  
  /**
   * Generate response to custom financial queries
   * @param {string} query - User's financial query
   * @param {Object} data - User's financial data
   * @returns {string} - Response to the query
   */
  export function answerCustomQuery(query, data) {
    if (!query || !data) return "Please provide both a query and your financial data.";
    
    // Normalize the query for better matching
    const normalizedQuery = query.toLowerCase();
    
    // Define key phrases and responses
    const responses = {
      // Saving related queries
      "how can i save": () => generateSavingsTips(data),
      "saving tips": () => generateSavingsTips(data),
      "save money": () => generateSavingsTips(data),
      
      // Investment related queries
      "how should i invest": () => generateInvestmentAdvice(data),
      "investment": () => generateInvestmentAdvice(data),
      "where to invest": () => generateInvestmentAdvice(data),
      
      // Budget related queries
      "budget": () => generateBudgetPlan(data),
      "create budget": () => generateBudgetPlan(data),
      "help with budget": () => generateBudgetPlan(data),
      
      // Debt related queries
      "debt": () => generateDebtManagementAdvice(data),
      "loan": () => generateDebtManagementAdvice(data),
      "credit": () => generateDebtManagementAdvice(data),
      
      // Emergency fund related queries
      "emergency fund": () => generateEmergencyFundAdvice(data),
      "rainy day fund": () => generateEmergencyFundAdvice(data),
      
      // Retirement related queries
      "retirement": () => generateRetirementAdvice(data),
      "retire": () => generateRetirementAdvice(data),
      
      // Category specific queries - dynamically handle based on available categories
      ...generateCategoryQueries(data),
      
      // Default fallback response
      "default": () => {
        return `## Response to Your Query\n\n` +
          `I understand you're asking about: "${query}"\n\n` +
          `Based on your financial situation:\n\n` +
          `- Monthly income: ₹${data.incomeAmount.toLocaleString()}\n` +
          `- Monthly expenses: ₹${data.expensesAmount.toLocaleString()}\n` +
          `- Remaining balance: ₹${data.remainingAmount.toLocaleString()}\n\n` +
          `Your current savings rate is ${((data.remainingAmount / data.incomeAmount) * 100).toFixed(1)}% of your income. ` +
          `Financial experts typically recommend saving 20% of your income.\n\n` +
          `For more specific advice, try asking about saving tips, investment recommendations, budgeting help, or specific spending categories.`;
      }
    };
    
    // Find the matching response
    for (const [phrase, responseFunc] of Object.entries(responses)) {
      if (phrase !== "default" && normalizedQuery.includes(phrase)) {
        return responseFunc();
      }
    }
    
    // If no match found, use default response
    return responses.default();
  }
  
  /**
   * Generate category-specific query handlers
   * @param {Object} data - User's financial data
   * @returns {Object} - Object with category queries and response functions
   */
  function generateCategoryQueries(data) {
    const categoryQueries = {};
    
    if (data && data.categories) {
      data.categories.forEach(category => {
        const categoryName = category.name.toLowerCase();
        categoryQueries[categoryName] = () => generateCategorySpecificAdvice(category, data);
      });
    }
    
    return categoryQueries;
  }
  
  /**
   * Generate savings tips based on financial data
   * @param {Object} data - User's financial data
   * @returns {string} - Savings tips
   */
  function generateSavingsTips(data) {
    const { incomeAmount, expensesAmount, remainingAmount, categories } = data;
    const spendingRatio = expensesAmount / incomeAmount;
    const savingsRate = (remainingAmount / incomeAmount) * 100;
    
    let adviceText = `## Savings Recommendations\n\n`;
    adviceText += `Your current savings rate is ${savingsRate.toFixed(1)}% of your income. `;
    
    if (savingsRate < 10) {
      adviceText += `This is below the recommended minimum savings rate of 10-15%.\n\n`;
    } else if (savingsRate < 20) {
      adviceText += `This is a good start, but financial experts typically recommend saving at least 20% of your income.\n\n`;
    } else {
      adviceText += `This is excellent and exceeds the typical recommendation of 20%!\n\n`;
    }
    
    // Calculate savings potential
    const savingsPotential = calculateSavingsPotential(data);
    
    adviceText += `### Savings Opportunities\n\n`;
    
    if (savingsPotential > 0) {
      adviceText += `By optimizing your spending across categories, you could potentially save an additional ₹${savingsPotential.toLocaleString()} per month.\n\n`;
    }
    
    // Add specific savings tips based on categories
    adviceText += `### Category-Specific Savings Tips\n\n`;
    
    // Sort categories by potential savings
    const categoriesWithPotential = categories.map(category => {
      const guidelines = CATEGORY_GUIDELINES[category.name] || CATEGORY_GUIDELINES.default;
      const recommendedSpending = incomeAmount * guidelines.ideal;
      const potential = Math.max(0, category.value - recommendedSpending);
      return { ...category, potential };
    }).sort((a, b) => b.potential - a.potential);
    
    // Take top 3 categories with savings potential
    categoriesWithPotential.slice(0, 3).forEach(category => {
      if (category.potential > 0) {
        const tips = EXPENSE_REDUCTION_TIPS[category.name] || EXPENSE_REDUCTION_TIPS.default;
        adviceText += `**${category.name} (₹${category.value.toLocaleString()})**: Potential savings of ₹${category.potential.toLocaleString()}\n`;
        
        // Add 2 random tips for this category
        const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 2);
        randomTips.forEach(tip => {
          adviceText += `- ${tip}\n`;
        });
        adviceText += `\n`;
      }
    });
    
    // Add general savings tips
    adviceText += `### General Savings Strategies\n\n`;
    adviceText += `- Follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings\n`;
    adviceText += `- Set up automatic transfers to savings accounts on payday\n`;
    adviceText += `- Use the 24-hour rule for non-essential purchases\n`;
    adviceText += `- Consider a no-spend challenge for one week each month\n`;
    adviceText += `- Track every expense using a budgeting app or spreadsheet\n`;
    
    return adviceText;
  }
  
  /**
   * Generate budget plan based on financial data
   * @param {Object} data - User's financial data
   * @returns {string} - Budget plan
   */
  function generateBudgetPlan(data) {
    const { incomeAmount, categories } = data;
    
    let adviceText = `## Personalized Budget Plan\n\n`;
    adviceText += `Based on your monthly income of ₹${incomeAmount.toLocaleString()}, here's a recommended budget allocation:\n\n`;
    
    // Calculate ideal spending for each category
    const idealBudget = {};
    let totalAllocated = 0;
    
    categories.forEach(category => {
      const guidelines = CATEGORY_GUIDELINES[category.name] || CATEGORY_GUIDELINES.default;
      const idealAmount = Math.round(incomeAmount * guidelines.ideal);
      idealBudget[category.name] = idealAmount;
      totalAllocated += idealAmount;
    });
    
    // Add "Savings" category with remaining amount
    const savingsAmount = incomeAmount - totalAllocated;
    idealBudget["Savings"] = savingsAmount;
    
    // Create budget table
    adviceText += `| Category | Current (₹) | Recommended (₹) | % of Income |\n`;
    adviceText += `|----------|-------------|-----------------|-------------|\n`;
    
    categories.forEach(category => {
      const recommended = idealBudget[category.name];
      const percentOfIncome = (recommended / incomeAmount * 100).toFixed(1);
      adviceText += `| ${category.name} | ${category.value.toLocaleString()} | ${recommended.toLocaleString()} | ${percentOfIncome}% |\n`;
    });
    
    // Add savings row
    const savingsPercent = (savingsAmount / incomeAmount * 100).toFixed(1);
    adviceText += `| Savings | - | ${savingsAmount.toLocaleString()} | ${savingsPercent}% |\n\n`;
    
    // Add budget implementation tips
    adviceText += `### Budget Implementation Tips\n\n`;
    adviceText += `1. **Use the envelope method**: Allocate cash or virtual funds to each category at the beginning of the month\n`;
    adviceText += `2. **Track expenses daily**: Use a budgeting app or spreadsheet to record all expenses\n`;
    adviceText += `3. **Review weekly**: Take 15 minutes each week to review your spending against your budget\n`;
    adviceText += `4. **Adjust as needed**: Your first budget is a starting point; refine it based on real spending patterns\n`;
    adviceText += `5. **Pay yourself first**: Transfer money to savings before spending on discretionary items\n`;
    
    return adviceText;
  }
  
  /**
   * Generate debt management advice
   * @param {Object} data - User's financial data
   * @returns {string} - Debt management advice
   */
  function generateDebtManagementAdvice(data) {
    const { incomeAmount, remainingAmount } = data;
    
    let adviceText = `## Debt Management Strategy\n\n`;
    adviceText += `Based on your financial data, here are recommendations for managing debt effectively:\n\n`;
    
    // Since we don't have actual debt information, provide general advice
    adviceText += `### Debt Repayment Strategies\n\n`;
    adviceText += `1. **Avalanche Method**: Pay minimum on all debts, then put extra money toward highest interest debt first\n`;
    adviceText += `2. **Snowball Method**: Pay minimum on all debts, then put extra money toward smallest debt first\n`;
    adviceText += `3. **Debt Consolidation**: Consider consolidating multiple high-interest debts into a single lower-interest loan\n\n`;
    
    // Calculate potential debt repayment
    const potentialMonthlyPayment = Math.round(remainingAmount * 0.8); // Assume 80% of remaining amount could go to debt
    adviceText += `Based on your current financial situation, you could potentially allocate ₹${potentialMonthlyPayment.toLocaleString()} monthly to debt repayment.\n\n`;
    
    // Add time estimates for debt repayment
    adviceText += `### Debt Repayment Timeline Estimates\n\n`;
    adviceText += `With a monthly payment of ₹${potentialMonthlyPayment.toLocaleString()}:\n\n`;
    adviceText += `- ₹1,00,000 debt at 10% interest: ~12 months to repay\n`;
    adviceText += `- ₹3,00,000 debt at 10% interest: ~36 months to repay\n`;
    adviceText += `- ₹5,00,000 debt at 10% interest: ~60 months to repay\n\n`;
    
    // Add interest savings tips
    adviceText += `### Tips to Reduce Interest Costs\n\n`;
    adviceText += `- Negotiate with creditors for lower interest rates\n`;
    // advisoryEngine.js (continued)

  adviceText += `- Negotiate with creditors for lower interest rates\n`;
  adviceText += `- Transfer high-interest credit card balances to cards with 0% intro APR\n`;
  adviceText += `- Pay more than the minimum payment whenever possible\n`;
  adviceText += `- Avoid taking on new debt while paying down existing debt\n`;
  adviceText += `- Consider balance transfer offers for credit card debt\n\n`;
  
  // Add debt prevention tips
  adviceText += `### Debt Prevention Strategies\n\n`;
  adviceText += `- Build an emergency fund of 3-6 months of expenses\n`;
  adviceText += `- Follow the 24-hour rule for non-essential purchases\n`;
  adviceText += `- Pay credit cards in full each month to avoid interest\n`;
  adviceText += `- Create and stick to a realistic budget\n`;
  adviceText += `- Increase your income through side hustles or career advancement\n`;
  
  return adviceText;
}

/**
 * Generate emergency fund advice
 * @param {Object} data - User's financial data
 * @returns {string} - Emergency fund advice
 */
function generateEmergencyFundAdvice(data) {
  const { incomeAmount, expensesAmount, remainingAmount } = data;
  
  // Calculate monthly expenses and recommended emergency fund size
  const monthlyExpenses = expensesAmount;
  const minEmergencyFund = monthlyExpenses * 3; // 3 months of expenses
  const optimalEmergencyFund = monthlyExpenses * 6; // 6 months of expenses
  
  // Calculate how long it would take to build the emergency fund
  const monthlyContribution = Math.round(remainingAmount * 0.5); // Assume 50% of savings goes to emergency fund
  const monthsToMinFund = Math.ceil(minEmergencyFund / monthlyContribution);
  const monthsToOptimalFund = Math.ceil(optimalEmergencyFund / monthlyContribution);
  
  let adviceText = `## Emergency Fund Strategy\n\n`;
  adviceText += `An emergency fund is essential for financial security. It provides a safety net for unexpected expenses like medical emergencies, car repairs, or job loss.\n\n`;
  
  // Recommended emergency fund size
  adviceText += `### Recommended Emergency Fund Size\n\n`;
  adviceText += `Based on your monthly expenses of ₹${monthlyExpenses.toLocaleString()}, your emergency fund should be:\n\n`;
  adviceText += `- **Minimum goal**: ₹${minEmergencyFund.toLocaleString()} (3 months of expenses)\n`;
  adviceText += `- **Optimal goal**: ₹${optimalEmergencyFund.toLocaleString()} (6 months of expenses)\n\n`;
  
  // Building the emergency fund
  adviceText += `### Building Your Emergency Fund\n\n`;
  adviceText += `With your current remaining monthly amount of ₹${remainingAmount.toLocaleString()}, you could contribute ₹${monthlyContribution.toLocaleString()} monthly to your emergency fund.\n\n`;
  adviceText += `- Time to reach minimum goal (3 months of expenses): ${monthsToMinFund} months\n`;
  adviceText += `- Time to reach optimal goal (6 months of expenses): ${monthsToOptimalFund} months\n\n`;
  
  // Where to keep the emergency fund
  adviceText += `### Where to Keep Your Emergency Fund\n\n`;
  adviceText += `Your emergency fund should be accessible but not too easy to spend:\n\n`;
  adviceText += `- **High-yield savings account**: Offers better interest rates than regular savings\n`;
  adviceText += `- **Fixed deposits with partial withdrawal**: Good balance of accessibility and returns\n`;
  adviceText += `- **Liquid funds**: Can provide slightly better returns with minimal risk\n\n`;
  
  // Building the fund faster
  adviceText += `### Tips to Build Your Fund Faster\n\n`;
  adviceText += `- Set up automatic transfers to your emergency fund account\n`;
  adviceText += `- Allocate any windfalls (tax refunds, bonuses, gifts) to your fund\n`;
  adviceText += `- Consider a temporary side income to accelerate your progress\n`;
  adviceText += `- Reduce discretionary spending temporarily to increase contributions\n`;
  adviceText += `- Start with a smaller goal (1 month of expenses) to build momentum\n`;
  
  return adviceText;
}

/**
 * Generate retirement planning advice
 * @param {Object} data - User's financial data
 * @returns {string} - Retirement planning advice
 */
function generateRetirementAdvice(data) {
  const { incomeAmount } = data;
  
  // Assume retirement age of 60 and current age of 30 (for illustration)
  const currentAge = 30;
  const retirementAge = 60;
  const yearsToRetirement = retirementAge - currentAge;
  
  // Calculate retirement corpus needed (using 80% of current income for 20 years)
  const monthlyExpensesInRetirement = incomeAmount * 0.8;
  const annualExpensesInRetirement = monthlyExpensesInRetirement * 12;
  const yearsInRetirement = 20;
  const inflationRate = 0.06; // 6% annual inflation
  const investmentReturn = 0.10; // 10% return during accumulation phase
  const postRetirementReturn = 0.07; // 7% return during retirement phase
  
  // Calculate future value of annual expenses
  const futureAnnualExpenses = annualExpensesInRetirement * Math.pow(1 + inflationRate, yearsToRetirement);
  
  // Calculate retirement corpus needed
  const retirementCorpus = futureAnnualExpenses * ((1 - Math.pow(1 + postRetirementReturn, -yearsInRetirement)) / postRetirementReturn);
  
  // Calculate required monthly investment
  const monthlyInvestmentNeeded = (retirementCorpus / Math.pow(1 + investmentReturn, yearsToRetirement)) / (yearsToRetirement * 12);
  
  let adviceText = `## Retirement Planning Strategy\n\n`;
  adviceText += `Planning for retirement is one of the most important financial goals. Here's a personalized retirement plan based on your current income.\n\n`;
  
  // Retirement corpus calculation
  adviceText += `### Retirement Corpus Required\n\n`;
  adviceText += `Assuming you retire at age 60 and live until 80:\n\n`;
  adviceText += `- Current monthly income: ₹${incomeAmount.toLocaleString()}\n`;
  adviceText += `- Estimated monthly expenses in retirement: ₹${monthlyExpensesInRetirement.toLocaleString()} (80% of current income)\n`;
  adviceText += `- Inflation-adjusted monthly expenses at retirement: ₹${Math.round(futureAnnualExpenses/12).toLocaleString()}\n`;
  adviceText += `- **Target retirement corpus**: ₹${Math.round(retirementCorpus).toLocaleString()}\n\n`;
  
  // Monthly investment required
  adviceText += `### Required Monthly Investment\n\n`;
  adviceText += `To build your retirement corpus over the next ${yearsToRetirement} years, you need to invest approximately ₹${Math.round(monthlyInvestmentNeeded).toLocaleString()} monthly, assuming an average annual return of 10%.\n\n`;
  
  // Investment allocation for retirement
  adviceText += `### Recommended Retirement Portfolio Allocation\n\n`;
  adviceText += `Based on a ${yearsToRetirement}-year time horizon:\n\n`;
  
  if (yearsToRetirement > 20) {
    adviceText += `- Equity funds: 70-75%\n`;
    adviceText += `- Debt instruments: 20-25%\n`;
    adviceText += `- Gold/Alternative investments: 5%\n`;
  } else if (yearsToRetirement > 10) {
    adviceText += `- Equity funds: 60-65%\n`;
    adviceText += `- Debt instruments: 30-35%\n`;
    adviceText += `- Gold/Alternative investments: 5%\n`;
  } else {
    adviceText += `- Equity funds: 40-50%\n`;
    adviceText += `- Debt instruments: 45-55%\n`;
    adviceText += `- Gold/Alternative investments: 5%\n`;
  }
  
  // Retirement investment options
  adviceText += `\n### Recommended Retirement Investment Vehicles\n\n`;
  adviceText += `1. **National Pension System (NPS)**: Tax-efficient retirement vehicle with equity exposure\n`;
  adviceText += `2. **Equity Linked Savings Scheme (ELSS)**: Tax-saving mutual funds with high growth potential\n`;
  adviceText += `3. **Public Provident Fund (PPF)**: Government-backed savings scheme with tax benefits\n`;
  adviceText += `4. **Mutual Fund SIPs**: Systematic investment for long-term wealth building\n`;
  adviceText += `5. **Corporate Fixed Deposits**: Higher interest rates than regular bank deposits\n`;
  
  return adviceText;
}

/**
 * Generate category-specific financial advice
 * @param {Object} category - Category data
 * @param {Object} data - User's financial data
 * @returns {string} - Category-specific advice
 */
function generateCategorySpecificAdvice(category, data) {
  const { incomeAmount } = data;
  const categoryValue = category.value;
  const categoryRatio = categoryValue / incomeAmount;
  const guidelines = CATEGORY_GUIDELINES[category.name] || CATEGORY_GUIDELINES.default;
  const tips = EXPENSE_REDUCTION_TIPS[category.name] || EXPENSE_REDUCTION_TIPS.default;
  
  let adviceText = `## ${category.name} Spending Analysis\n\n`;
  adviceText += `Your current ${category.name.toLowerCase()} spending is ₹${categoryValue.toLocaleString()} per month, which is ${(categoryRatio * 100).toFixed(1)}% of your income.\n\n`;
  
  // Compare with guidelines
  if (categoryRatio > guidelines.high) {
    adviceText += `**This is significantly higher than recommended.** Financial experts suggest keeping ${category.name.toLowerCase()} expenses to ${(guidelines.ideal * 100).toFixed(0)}-${(guidelines.high * 100).toFixed(0)}% of your income (₹${Math.round(incomeAmount * guidelines.ideal).toLocaleString()}-₹${Math.round(incomeAmount * guidelines.high).toLocaleString()}).\n\n`;
  } else if (categoryRatio > guidelines.ideal) {
    adviceText += `**This is slightly higher than ideal.** Financial experts suggest keeping ${category.name.toLowerCase()} expenses to around ${(guidelines.ideal * 100).toFixed(0)}% of your income (₹${Math.round(incomeAmount * guidelines.ideal).toLocaleString()}).\n\n`;
  } else {
    adviceText += `**This is within the recommended range.** Financial experts suggest keeping ${category.name.toLowerCase()} expenses to ${(guidelines.ideal * 100).toFixed(0)}-${(guidelines.high * 100).toFixed(0)}% of your income, and you're doing well at ${(categoryRatio * 100).toFixed(1)}%.\n\n`;
  }
  
  // Add specific tips
  adviceText += `### Tips to Optimize ${category.name} Spending\n\n`;
  tips.forEach(tip => {
    adviceText += `- ${tip}\n`;
  });
  
  // Add benchmark information if available
  if (category.name in CATEGORY_GUIDELINES) {
    adviceText += `\n### Benchmarking Information\n\n`;
    adviceText += `The average Indian household spends approximately ${(CATEGORY_GUIDELINES[category.name].ideal * 100).toFixed(0)}-${(CATEGORY_GUIDELINES[category.name].high * 100).toFixed(0)}% of their income on ${category.name.toLowerCase()}.\n`;
    
    // Additional category-specific benchmarking
    if (category.name === "Housing") {
      adviceText += `In urban areas, the recommended housing expense is 25-30% of income, while in metro cities it may reach up to 35-40%.\n`;
    } else if (category.name === "Food") {
      adviceText += `A single person typically spends ₹6,000-₹10,000 per month on food, while a family of four spends ₹15,000-₹25,000 per month.\n`;
    } else if (category.name === "Transportation") {
      adviceText += `The average cost of commuting in urban areas ranges from ₹3,000-₹6,000 per month, excluding vehicle loans.\n`;
    }
  }
  
  return adviceText;  
}