// Financial Terms Database
const financialTerms = {
    basic: [
        {
            term: "BUDGET",
            hint: "A plan for managing income and expenses",
            definition: "A financial plan that helps track and manage money"
        },
        {
            term: "SAVINGS",
            hint: "Money set aside for future use",
            definition: "Money kept for future needs or emergencies"
        },
        {
            term: "INTEREST",
            hint: "Money paid for borrowing or earned from saving",
            definition: "The cost of borrowing money or return on savings"
        }
    ],
    intermediate: [
        {
            term: "INVESTMENT",
            hint: "Using money to make more money",
            definition: "Putting money into assets expecting future returns"
        },
        {
            term: "DIVIDEND",
            hint: "Company profits paid to shareholders",
            definition: "Regular payment made to company shareholders"
        },
        {
            term: "PORTFOLIO",
            hint: "Collection of financial investments",
            definition: "A mix of different investments owned by a person"
        }
    ],
    advanced: [
        {
            term: "DIVERSIFICATION",
            hint: "Spreading investments to reduce risk",
            definition: "Strategy of investing in different assets to manage risk"
        },
        {
            term: "COMPOUND_INTEREST",
            hint: "Interest earned on previous interest",
            definition: "Interest calculated on initial principal and accumulated interest"
        },
        {
            term: "DEPRECIATION",
            hint: "Decrease in value over time",
            definition: "Reduction in the value of an asset over time"
        }
    ]
};

// Financial Math Problems Database
const financialMathProblems = {
    basic: [
        {
            question: "If you save $100 per month, how much will you save in one year?",
            options: ["$1,200", "$1,000", "$1,500", "$800"],
            correct: 0,
            explanation: "Monthly savings × 12 months = Yearly savings: $100 × 12 = $1,200"
        },
        {
            question: "What is 10% of $500?",
            options: ["$50", "$100", "$75", "$25"],
            correct: 0,
            explanation: "To find 10%, multiply by 0.10: $500 × 0.10 = $50"
        }
    ],
    intermediate: [
        {
            question: "If you invest $1,000 with 5% annual interest, how much will you have after one year?",
            options: ["$1,050", "$1,500", "$1,005", "$1,150"],
            correct: 0,
            explanation: "Principal + (Principal × Interest Rate) = $1,000 + ($1,000 × 0.05) = $1,050"
        },
        {
            question: "How much will you need to save monthly to reach $6,000 in one year?",
            options: ["$500", "$450", "$600", "$550"],
            correct: 0,
            explanation: "Yearly goal ÷ 12 months = Monthly savings: $6,000 ÷ 12 = $500"
        }
    ],
    advanced: [
        {
            question: "If you invest $2,000 with 6% annual compound interest, how much will you have after 2 years?",
            options: ["$2,247.20", "$2,240", "$2,120", "$2,200"],
            correct: 0,
            explanation: "Principal × (1 + rate)^years = $2,000 × (1 + 0.06)² = $2,247.20"
        },
        {
            question: "What is the monthly payment on a $20,000 loan at 4% APR for 3 years?",
            options: ["$591.75", "$600", "$550", "$575"],
            correct: 0,
            explanation: "Using loan payment formula: PMT = Principal × (r(1+r)^n)/((1+r)^n-1)"
        }
    ]
};

// Financial Learning Tips
const financialTips = [
    "Start saving early to take advantage of compound interest",
    "Create and stick to a budget to manage your money better",
    "Diversify your investments to spread risk",
    "Pay yourself first by automatically saving part of your income",
    "Keep an emergency fund for unexpected expenses",
    "Review your financial goals regularly",
    "Understand the difference between needs and wants",
    "Compare prices and shop smart to save money",
    "Learn about different investment options",
    "Track your spending to identify areas for improvement"
];

// Game Achievement Criteria
const achievements = {
    wordScramble: [
        {
            name: "Vocabulary Builder",
            description: "Learn 10 new financial terms",
            requirement: 10
        },
        {
            name: "Finance Expert",
            description: "Successfully unscramble 20 advanced terms",
            requirement: 20
        }
    ],
    mathQuiz: [
        {
            name: "Calculator Pro",
            description: "Solve 10 math problems correctly",
            requirement: 10
        },
        {
            name: "Math Wizard",
            description: "Get a perfect score in advanced mode",
            requirement: "perfectScore"
        }
    ],
    memoryMatch: [
        {
            name: "Memory Master",
            description: "Complete the game in under 20 moves",
            requirement: 20
        },
        {
            name: "Perfect Match",
            description: "Find all pairs without any mistakes",
            requirement: "noMistakes"
        }
    ]
};

// Export all data
export {
    financialTerms,
    financialMathProblems,
    financialTips,
    achievements
}; 