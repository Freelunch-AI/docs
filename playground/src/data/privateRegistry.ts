import type { MarketplaceBlock } from './marketplaceBlocks';

// Private Registry Blocks - Company-specific internal blocks
export const privateRegistryBlocks: MarketplaceBlock[] = [
  {
    id: 'company-auth-service',
    name: 'Company SSO Integration',
    type: 'service',
    classification: 'concrete',
    blockLabel: 'app-service',
    category: 'code',
    description: 'Internal single sign-on service integrated with company Microsoft Entra ID',
    longDescription: 'Production-ready SSO integration service that connects all internal applications to our Microsoft Entra ID tenant. Handles OAuth2 authentication flows, token management, and user profile synchronization.',
    tags: ['authentication', 'sso', 'entra-id', 'oauth2', 'internal'],
    author: 'Platform Team',
    lastUpdated: '2025-11-05',
    version: '2.3.1',
    icon: '🔐',
    stats: {
      stars: 127,
      downloads: 450
    },
    languages: ['Python'],
    framework: 'FastAPI',
    isAI: false,
    isMaintained: true,
    isStateful: true,
    deploymentArchitecture: 'single-service',
    clientCode: `from company_sso import SSOClient

# Initialize SSO client
sso = SSOClient(
    tenant_id=os.getenv('ENTRA_TENANT_ID'),
    client_id=os.getenv('ENTRA_CLIENT_ID'),
    client_secret=os.getenv('ENTRA_CLIENT_SECRET')
)

@app.post('/api/login')
async def login(credentials: LoginRequest):
    # Authenticate with company SSO
    token = await sso.authenticate(
        username=credentials.username,
        password=credentials.password
    )
    
    return {'access_token': token.access_token, 'expires_in': token.expires_in}

@app.get('/api/user/profile')
async def get_profile(token: str = Depends(oauth2_scheme)):
    # Get user profile from SSO
    user = await sso.get_user_profile(token)
    return user.to_dict()`,
    internalArchitecture: {
      entrypoints: ['sso-service'],
      services: [
        {
          id: 'sso-service',
          name: 'SSO Service',
          description: 'Handles authentication with Microsoft Entra ID',
          port: 8000,
          containerStructure: {
            files: [
              {
                path: 'main.py',
                content: `from fastapi import FastAPI, Depends, HTTPException
from msal import ConfidentialClientApplication
import os

app = FastAPI()

# MSAL configuration
msal_app = ConfidentialClientApplication(
    client_id=os.getenv('ENTRA_CLIENT_ID'),
    client_credential=os.getenv('ENTRA_CLIENT_SECRET'),
    authority=f"https://login.microsoftonline.com/{os.getenv('ENTRA_TENANT_ID')}"
)

@app.post('/authenticate')
async def authenticate(username: str, password: str):
    result = msal_app.acquire_token_by_username_password(
        username=username,
        password=password,
        scopes=['User.Read']
    )
    
    if 'access_token' in result:
        return {'access_token': result['access_token']}
    else:
        raise HTTPException(status_code=401, detail='Authentication failed')`
              }
            ],
            dockerfile: `FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
            entrypoint: 'main.py'
          }
        }
      ],
      connections: []
    }
  },
  {
    id: 'company-ml-inference',
    name: 'Product Recommendation Engine',
    type: 'service',
    classification: 'concrete',
    blockLabel: 'app-service',
    category: 'code',
    description: 'Internal ML model for product recommendations trained on company data',
    longDescription: 'Deep learning-based recommendation engine trained on our historical sales and user behavior data. Provides real-time personalized product recommendations with sub-100ms latency.',
    tags: ['ml', 'recommendations', 'inference', 'pytorch', 'internal'],
    author: 'ML Team',
    lastUpdated: '2025-11-10',
    version: '1.5.0',
    icon: '🤖',
    stats: {
      stars: 89,
      downloads: 210
    },
    languages: ['Python'],
    framework: 'FastAPI + PyTorch',
    isAI: true,
    isMaintained: true,
    isStateful: false,
    deploymentArchitecture: 'distributed',
    clientCode: `from company_ml import RecommendationClient

# Initialize recommendation client
recommender = RecommendationClient(
    model_version='v1.5.0',
    endpoint='http://recommendation-engine:8000'
)

@app.get('/api/recommendations/{user_id}')
async def get_recommendations(user_id: str, limit: int = 10):
    # Get personalized recommendations
    recommendations = await recommender.get_recommendations(
        user_id=user_id,
        limit=limit,
        context={'page': 'homepage'}
    )
    
    return {'recommendations': recommendations}`,
    internalArchitecture: {
      entrypoints: ['ml-service'],
      services: [
        {
          id: 'ml-service',
          name: 'ML Inference Service',
          description: 'Serves product recommendations using trained PyTorch model',
          port: 8000,
          containerStructure: {
            files: [
              {
                path: 'inference.py',
                content: `import torch
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Load trained model
model = torch.jit.load('/models/recommendation_model.pt')
model.eval()

class RecommendationRequest(BaseModel):
    user_id: str
    context: dict
    limit: int = 10

@app.post('/recommend')
async def recommend(request: RecommendationRequest):
    with torch.no_grad():
        # Prepare input features
        features = prepare_features(request.user_id, request.context)
        
        # Run inference
        scores = model(features)
        
        # Get top K recommendations
        top_k = torch.topk(scores, request.limit)
        
    return {'product_ids': top_k.indices.tolist(), 'scores': top_k.values.tolist()}`
              }
            ],
            dockerfile: `FROM python:3.11-slim

RUN pip install torch fastapi uvicorn pydantic

WORKDIR /app
COPY . .

CMD ["uvicorn", "inference:app", "--host", "0.0.0.0", "--port", "8000"]`,
            entrypoint: 'inference.py'
          }
        }
      ],
      connections: []
    }
  },
  {
    id: 'company-data-pipeline',
    name: 'Daily Sales Analytics DAG',
    type: 'dag',
    classification: 'concrete',
    blockLabel: 'ir-infra',
    category: 'code-workloads-infra',
    description: 'ETL DAG processing daily sales data and updating analytics dashboard',
    longDescription: 'Automated daily ETL DAG that orchestrates sales data extraction from operational databases, performs aggregations and transformations, and loads processed data into our analytics warehouse. Powers executive dashboards and reports.',
    tags: ['dag', 'etl', 'analytics', 'sales', 'airflow', 'internal'],
    author: 'Data Team',
    lastUpdated: '2025-11-08',
    version: '3.1.0',
    icon: '📊',
    stats: {
      stars: 54,
      downloads: 180
    },
    languages: ['Python'],
    framework: 'Apache Airflow',
    isAI: false,
    isMaintained: true,
    isStateful: true,
    deploymentArchitecture: 'single-service',
    clientCode: `# This pipeline runs automatically via Airflow scheduler
# Triggered daily at 2:00 AM UTC
# Dashboard: http://airflow.company.internal/dags/daily_sales_analytics

# To manually trigger:
from airflow.api.client import Client

client = Client(auth=('admin', 'password'))
client.trigger_dag(dag_id='daily_sales_analytics')`,
    internalArchitecture: {
      entrypoints: ['airflow-scheduler'],
      services: [
        {
          id: 'airflow-scheduler',
          name: 'Airflow Scheduler',
          description: 'Schedules and orchestrates the ETL pipeline',
          port: 8080,
          containerStructure: {
            files: [
              {
                path: 'dags/sales_analytics.py',
                content: `from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

def extract_sales_data(**context):
    # Extract from operational DB
    pass

def transform_data(**context):
    # Clean and aggregate
    pass

def load_to_warehouse(**context):
    # Load to analytics DB
    pass

with DAG(
    'daily_sales_analytics',
    start_date=datetime(2025, 1, 1),
    schedule_interval='0 2 * * *',
    catchup=False
) as dag:
    extract = PythonOperator(task_id='extract', python_callable=extract_sales_data)
    transform = PythonOperator(task_id='transform', python_callable=transform_data)
    load = PythonOperator(task_id='load', python_callable=load_to_warehouse)
    
    extract >> transform >> load`
              }
            ],
            dockerfile: `FROM apache/airflow:2.7.0

COPY dags/ /opt/airflow/dags/

CMD ["scheduler"]`,
            entrypoint: 'dags/sales_analytics.py'
          }
        }
      ],
      connections: []
    }
  },
  {
    id: 'company-legacy-wrapper',
    name: 'Legacy Mainframe API Wrapper',
    type: 'service',
    classification: 'concrete',
    blockLabel: 'app-service',
    category: 'code',
    description: 'REST API wrapper for legacy mainframe system (COBOL)',
    longDescription: 'REST API wrapper that provides modern HTTP access to our legacy mainframe COBOL procedures via CICS gateway. Note: This service is deprecated and no longer maintained. Migrate to new customer API.',
    tags: ['legacy', 'mainframe', 'cobol', 'wrapper', 'internal'],
    author: 'Integration Team',
    lastUpdated: '2024-09-15',
    version: '0.8.2',
    icon: '🏛️',
    stats: {
      stars: 23,
      downloads: 95
    },
    languages: ['Java'],
    framework: 'Spring Boot',
    isAI: false,
    isMaintained: false, // Not maintained
    isStateful: false,
    deploymentArchitecture: 'single-service',
    clientCode: `import requests

# Query legacy system via REST wrapper
response = requests.post(
    'http://legacy-wrapper:8080/api/customer/query',
    json={'customer_id': '12345'},
    headers={'Authorization': f'Bearer {token}'}
)

customer_data = response.json()
print(f"Customer: {customer_data['name']}")`,
    internalArchitecture: {
      entrypoints: ['wrapper-service'],
      services: [
        {
          id: 'wrapper-service',
          name: 'Mainframe Wrapper',
          description: 'Translates REST calls to mainframe COBOL procedures',
          port: 8080,
          containerStructure: {
            files: [
              {
                path: 'src/main/java/MainframeController.java',
                content: `@RestController
@RequestMapping("/api")
public class MainframeController {
    
    @Autowired
    private MainframeClient mainframeClient;
    
    @PostMapping("/customer/query")
    public CustomerDTO queryCustomer(@RequestBody CustomerQuery query) {
        // Call COBOL procedure via CICS gateway
        MainframeResponse response = mainframeClient.callProcedure(
            "GETCUST",
            query.getCustomerId()
        );
        
        return parseResponse(response);
    }
}`
              }
            ],
            dockerfile: `FROM openjdk:17-slim

COPY target/mainframe-wrapper.jar /app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]`,
            entrypoint: 'src/main/java/MainframeController.java'
          }
        }
      ],
      connections: []
    }
  }
];

// Library Guidance per Language
export interface LibraryGuidance {
  language: string;
  mandatory: LibraryRequirement[];
  recommended: LibraryRequirement[];
  notRecommended: LibraryRequirement[];
  prohibited: LibraryRequirement[];
}

export interface LibraryRequirement {
  name: string;
  version?: string;
  purpose: string;
  reason: string;
}

export const libraryGuidance: LibraryGuidance[] = [
  {
    language: 'Python',
    mandatory: [
      {
        name: 'pydantic',
        version: '^2.0.0',
        purpose: 'Runtime data validation',
        reason: 'Required for request/response validation and data integrity'
      },
      {
        name: 'python-dotenv',
        version: '^1.0.0',
        purpose: 'Environment configuration',
        reason: 'Standard way to manage environment variables'
      }
    ],
    recommended: [
      {
        name: 'pytest',
        version: '^7.0.0',
        purpose: 'Testing framework',
        reason: 'Industry standard for Python testing'
      },
      {
        name: 'httpx',
        version: '^0.24.0',
        purpose: 'HTTP client',
        reason: 'Modern async-compatible HTTP client'
      },
      {
        name: 'structlog',
        version: '^23.0.0',
        purpose: 'Structured logging',
        reason: 'Better observability with structured logs'
      }
    ],
    notRecommended: [
      {
        name: 'requests',
        purpose: 'HTTP client',
        reason: 'Lacks async support, use httpx instead'
      },
      {
        name: 'pickle',
        purpose: 'Serialization',
        reason: 'Security risks, use JSON or MessagePack instead'
      }
    ],
    prohibited: [
      {
        name: 'eval()',
        purpose: 'Dynamic code execution',
        reason: 'Critical security vulnerability'
      },
      {
        name: 'exec()',
        purpose: 'Dynamic code execution',
        reason: 'Critical security vulnerability'
      }
    ]
  },
  {
    language: 'TypeScript',
    mandatory: [
      {
        name: 'zod',
        version: '^3.0.0',
        purpose: 'Runtime schema validation',
        reason: 'Type-safe runtime validation required for API boundaries'
      },
      {
        name: '@types/node',
        version: '^20.0.0',
        purpose: 'Node.js type definitions',
        reason: 'Required for TypeScript type checking'
      }
    ],
    recommended: [
      {
        name: 'vitest',
        version: '^1.0.0',
        purpose: 'Testing framework',
        reason: 'Fast, Vite-native testing framework'
      },
      {
        name: 'prettier',
        version: '^3.0.0',
        purpose: 'Code formatting',
        reason: 'Consistent code style across codebase'
      }
    ],
    notRecommended: [
      {
        name: 'lodash',
        purpose: 'Utility functions',
        reason: 'Modern JS/TS has built-in equivalents'
      }
    ],
    prohibited: [
      {
        name: 'any type usage',
        purpose: 'Type bypass',
        reason: 'Defeats purpose of TypeScript type safety'
      }
    ]
  },
  {
    language: 'Go',
    mandatory: [
      {
        name: 'go mod',
        purpose: 'Dependency management',
        reason: 'Official Go dependency management tool'
      }
    ],
    recommended: [
      {
        name: 'github.com/stretchr/testify',
        purpose: 'Testing assertions',
        reason: 'Standard testing toolkit with good assertions'
      },
      {
        name: 'github.com/sirupsen/logrus',
        purpose: 'Structured logging',
        reason: 'Production-ready structured logger'
      }
    ],
    notRecommended: [],
    prohibited: [
      {
        name: 'CGO',
        purpose: 'C interop',
        reason: 'Breaks cross-compilation and increases complexity'
      }
    ]
  }
];

// Coding Conventions per Language
export interface CodingConvention {
  language: string;
  mandatory: Convention[];
  recommended: Convention[];
}

export interface Convention {
  name: string;
  description: string;
  example?: string;
}

export const codingConventions: CodingConvention[] = [
  {
    language: 'Python',
    mandatory: [
      {
        name: 'Type Hints',
        description: 'All function signatures must include type hints',
        example: `def process_user(user_id: str, age: int) -> UserProfile:
    return UserProfile(id=user_id, age=age)`
      },
      {
        name: 'Docstrings',
        description: 'All public functions and classes must have docstrings',
        example: `def calculate_total(items: list[Item]) -> float:
    """Calculate total price of items.
    
    Args:
        items: List of items to sum
        
    Returns:
        Total price as float
    """`
      }
    ],
    recommended: [
      {
        name: 'PEP 8',
        description: 'Follow PEP 8 style guide for code formatting',
        example: 'max_line_length = 88 (Black formatter default)'
      },
      {
        name: 'f-strings',
        description: 'Use f-strings for string formatting',
        example: `name = "Alice"
message = f"Hello, {name}!"  # Good
message = "Hello, " + name + "!"  # Avoid`
      }
    ]
  },
  {
    language: 'TypeScript',
    mandatory: [
      {
        name: 'Strict Mode',
        description: 'Enable strict mode in tsconfig.json',
        example: `{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}`
      },
      {
        name: 'Explicit Return Types',
        description: 'Functions must declare return types',
        example: `function getUser(id: string): Promise<User> {
  return fetchUser(id);
}`
      }
    ],
    recommended: [
      {
        name: 'ESLint',
        description: 'Use ESLint with recommended TypeScript rules',
        example: '@typescript-eslint/recommended'
      },
      {
        name: 'Named Exports',
        description: 'Prefer named exports over default exports',
        example: `// Good
export const UserService = { ... }

// Avoid
export default { ... }`
      }
    ]
  },
  {
    language: 'Go',
    mandatory: [
      {
        name: 'gofmt',
        description: 'All code must be formatted with gofmt',
        example: 'Run gofmt -w . before committing'
      },
      {
        name: 'Error Handling',
        description: 'Never ignore errors, always check and handle',
        example: `// Good
if err != nil {
    return fmt.Errorf("failed to process: %w", err)
}

// Bad
_ = process()  // ignoring error`
      }
    ],
    recommended: [
      {
        name: 'golangci-lint',
        description: 'Use golangci-lint for comprehensive linting',
        example: 'golangci-lint run'
      },
      {
        name: 'Table-driven Tests',
        description: 'Use table-driven tests for multiple test cases',
        example: `tests := []struct {
    input    string
    expected int
}{
    {"test1", 1},
    {"test2", 2},
}`
      }
    ]
  }
];
