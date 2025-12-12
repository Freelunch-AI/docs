# Interactive Web Playground Specification
## lunch-idp Core Experience Demo - VSCode Extension Mockup

**Purpose**: Enable engineers to understand lunch-idp's value proposition through hands-on exploration of lunch-hub, lunch-cycle, and lunch-observe modules without installation, presented as a realistic VSCode extension interface.

**Target Audience**: Backend engineers at scale-ups evaluating IDPs; Platform engineers exploring modern tooling.

**Key Value Propositions to Demonstrate**:
1. **Lego Block Experience**: Building distributed systems by composing reusable, configurable blocks (concrete, custom, and virtual)
2. **Serverless Developer Experience**: Focus on application code without needing Docker, Terraform, Kubernetes, or AWS knowledge
3. **HuggingFace for Software Engineering**: Visual, friendly marketplace for discovering and using infrastructure, service, and workloads infrastructure blocks
4. **Interactive PR Previews**: Compare main vs feature branch systems side-by-side with semantic diffs (cost, performance, architecture, service dependencies)
5. **Declarative, Visual, Multi-language**: Modern approach to platform engineering following GitOps principles
6. **Sandbox Testing**: Preview blocks in action with realistic sample workloads
7. **Production-Ready Code**: All examples use realistic Python code with lunch-time SDK and lunch-metalang

---

## 1. Architecture Overview - VSCode Extension Mockup

### VSCode Extension Interface Design

**Main Layout**: The playground simulates a VSCode window with dark theme, mimicking the look and feel of a real VSCode extension.

**Components**:
- **Left Sidebar (Activity Bar)**: Icons for the three lunch-idp extensions
  - 🔄 **lunch-cycle** icon (cycle/workflow symbol)
  - 🏪 **lunch-hub** icon (marketplace/blocks symbol)  
  - 📊 **lunch-observe** icon (monitoring/chart symbol)
- **Main Editor Area**: 
  - Can display extensions in **fullscreen mode** (takes entire editor space)
  - Can display extensions in **split mode** (editor on left, extension panel on right)
  - Shows realistic VSCode tabs, breadcrumbs, and command palette styling
- **VSCode Chrome**: Mock title bar, menu bar, status bar with realistic styling
- **Theme**: VSCode Dark+ theme (default dark theme colors)

**Extension Display Modes**:
1. **Fullscreen**: Extension takes over entire editor area (default for lunch-hub and lunch-observe)
2. **Split View**: Code editor on left (60%), extension panel on right (40%) - used in lunch-cycle for viewing service code alongside architecture
3. **Tabbed**: Multiple extensions can be opened as tabs, switchable via tab bar

### Tech Stack (Fully Client-Side)
- **Frontend**: React + TypeScript, Monaco Editor (VS Code's editor), React Flow (node-based UI)
- **State Management**: Zustand for app state (lightweight, no backend needed)
- **Git Simulation**: Client-side state management (no real git, just branch/commit switching)
- **Code Validation**: Client-side syntax checking using Monaco's built-in TypeScript/Python parsers
- **Data Storage**: All sample data embedded as JSON modules, no API calls
- **Styling**: Tailwind CSS for rapid UI development
- **Build Tool**: Vite for fast builds and optimized static output
- **Deployment**: Pure static files (HTML/CSS/JS) - can be hosted on GitHub Pages, Vercel, Netlify, or any CDN

### Sample System (Pre-loaded Static Data)

Pre-loaded microservice e-commerce system: **"MicroMart"**

**Services (4 in main, 5 in feature branch)**:

- `product-catalog` - Product listing and search API
- `order-service` - Order creation and management
- `payment-gateway` - Payment processing integration
- `notification-service` - Email/SMS notifications
- `recommendation-service` (feature branch only) - ML-powered product recommendations

**Services (not Infrastructure) Blocks (3)**:

- PostgreSQL 16 Database - Products and order data storage service
- Redis 7 Cache - Product catalog caching service
- Kafka Message Broker - Event streaming service

**Workloads Infrastructure Blocks (2)**:

- EKS Cluster (AWS) - Kubernetes cluster running services
- EC2 Cluster - Alternative compute infrastructure option

**Infrastructure Blocks (2)**:

- OpenStack - Private cloud infrastructure platform
- AWS Account - Public cloud infrastructure foundation

**Block Type Classification** (displayed on each block):

- **Concrete Block**: Atomic block that is not composed of other blocks - a single, indivisible unit (e.g., PostgreSQL 16, Redis 7, a single microservice, an EKS cluster)
- **Custom Block**: Composite block made of multiple blocks - takes blocks as arguments and internally is a system of blocks interacting with each other (e.g., a complete e-commerce platform block composed of product-catalog + order-service + payment-gateway + PostgreSQL blocks)
- **Virtual Block**: Abstract interface/contract without concrete implementation (e.g., "Cache" interface that could be Redis/Memcached, "Database" interface that could be PostgreSQL/MySQL)

**Communication Patterns**:
- Services use `lunch-rpc` (declarative RPC communication abstraction over gRPC)
- Service dependencies are clearly visualized with dependency type indicators:
  - **Read-Only** (blue arrow): Service reads data (GET requests, queries)
  - **Write** (red arrow): Service writes/mutates data (POST/PUT/DELETE, inserts/updates)
  - **Read/Write** (purple bidirectional arrow): Service both reads and writes
  - **Request/Response** (solid line): Synchronous RPC calls
  - **Streaming** (dashed line): Async event streaming (Kafka, WebSocket)
- `lunch-time` SDK provides runtime abstractions for:
  - **Database**: `Database("products-db")` - abstraction over PostgreSQL
  - **Cache**: `Cache("product-cache")` - abstraction over Redis
  - **PubSub**: `PubSub("orders-topic")` - abstraction over Kafka
  - **Secrets**: `Secrets.get("stripe-api-key")` - abstraction over Vault
  - **RPC**: `RPC.call("service", "/endpoint", payload)` - inter-service calls

**Branches (Git Simulation)**:
- `main` (stable, 4 services) - Current production state
- `feature/add-recommendations` (5 services) - PR branch showing architectural evolution
  - Adds new `recommendation-service`
  - Modifies `product-catalog` to call recommendation service
  - Shows cost delta (+$45/month), performance improvement (-15ms p95 latency)

**Block Definition Format** (following OAM-like structure):
- Each block has: name, version, type, arguments, dependencies, metadata, code (for services)
- Stored as static TypeScript/JSON modules imported at build time
- Example: `blocks/product-catalog.ts`, `blocks/postgres-ha.ts`

---

## 2. Module Specifications

### 2.1 lunch-cycle: Microservice Lifecycle IDE

#### Main Canvas (Node-Based Editor)
**Layout**: Center canvas with node-graph visualization using React Flow

**Node Types** (visual representation of lunch-idp blocks):

1. **Service Blocks** (green gradient, #10B981): Rounded rectangles with microservice icon + name
   - Represent application-level workloads (Python, Go, Rust, Java services)
   - Contain application code, expose endpoints, can call other services via lunch-rpc
   - Examples: API services, background workers, event handlers
   - **Must run on top of a Workloads Infrastructure Block** (EKS, EC2 cluster)
   - Visual indicator shows which workloads infra block they're deployed to
2. **Service Blocks (not Infrastructure)** (cyan gradient, #06B6D4): Database/cache/queue icons + resource name
   - Represent stateful backing services (PostgreSQL, Redis, Kafka, S3, etc.)
   - Provisioned via tool-agnostic abstractions (can switch PostgreSQL to MySQL)
   - Accessed by services via lunch-time SDK (not direct connections)
   - **Also run on top of Workloads Infrastructure Blocks**
   - Examples: Managed database services, message brokers, caching layers
3. **Workloads Infrastructure Blocks** (purple gradient, #8B5CF6): Kubernetes/container runtime icons
   - Represent compute platforms where services and service blocks run (EKS cluster, EC2 cluster, GKE, AKS)
   - Foundation for deploying containerized workloads
   - Examples: Kubernetes clusters, container orchestration platforms
   - **Run on top of Infrastructure Blocks** (AWS, OpenStack, etc.)
4. **Infrastructure Blocks** (dark blue gradient, #1E40AF): Cloud provider / datacenter icons
   - Represent foundational cloud infrastructure (AWS Account, OpenStack, Azure Subscription, GCP Project)
   - Base layer that provides compute, storage, networking primitives
   - Everything else runs on top of these
   - Examples: Cloud provider accounts, private cloud platforms
5. **Pipeline Blocks** (orange gradient, #F59E0B): Data flow / ETL process icons
   - Represent DAGs, batch jobs, streaming pipelines
   - Not emphasized in initial playground (focus on real-time services)

**Block Type Badge** (displayed on each node):

- 🔷 **Concrete**: Atomic, single block (e.g., "PostgreSQL 16 - Concrete", "product-catalog - Concrete")
- 🔶 **Custom**: Composite, blocks of blocks (e.g., "E-commerce Platform - Custom" which contains multiple service and infrastructure blocks)
- ⬜ **Virtual**: Abstract interface (e.g., "Cache Interface - Virtual")

**Node Properties Panel** (expandable right sidebar, slides in on node click):

**Common Properties (all block types)**:
- **Name**: Block identifier (e.g., `product-catalog`, `products-db`)
- **Version**: Semantic version (e.g., `v1.2.3`)
- **Description**: Human-readable purpose (markdown supported)
- **Type**: Service / Infrastructure / Pipeline
- **Arguments**: Key-value configuration
  - Example (PostgreSQL): `db_name: "products"`, `replicas: 3`, `backup_enabled: true`
  - Example (Service): `port: 8080`, `workers: 4`, `env: "production"`
  - Editable in playground (changes highlighted in yellow, not persisted)
- **Dependencies**: List of connected blocks with relationship type
  - Example: `product-catalog` → depends on → `products-db` (database), `product-cache` (cache)
  - Visualized as arrows on canvas when "View Dependencies Graph" is toggled
- **Metadata**:
  - **Cost**: Monthly estimate (e.g., `$45/month` for basic service, `$120/month` for HA PostgreSQL)
  - **Resources**: CPU (e.g., `500m`), Memory (e.g., `512Mi`)
  - **Health**: Status indicator (🟢 healthy, 🟡 degraded, 🔴 down) - simulated
  - **Uptime**: `99.95%` - mocked value
  - **Created**: `2024-11-01` - sample date
  - **Author**: `@username` or `@lunch-official`

**Service Blocks Only**:
- **"Open Code Editor"** button → launches service mini-IDE modal
- **Endpoints**: List of exposed APIs (e.g., `GET /products/{id}`, `POST /products`)
- **RPC Calls**: List of outgoing calls to other services (parsed from code)
  - Example: `RPC.call("payment-gateway", "/charge")` detected → shows dependency
- **Language**: Python / Go / Rust / Java (with icon)
- **Framework**: FastAPI / Gin / Actix / Spring Boot (informational)

**Service Mini-IDE** (modal overlay, 80% viewport width/height):

Opens when clicking "Open Code Editor" on service node - demonstrates how lunch-idp makes service code simple and declarative. **Now shows a full directory structure, not just a single file.**

**Layout**:

- **File tree (left sidebar, 25%)** - Interactive VSCode-style file explorer:

  ```text
  product-catalog/
  ├── 📁 src/
  │   ├── 📄 main.py              # Service entry point with @service decorator
  │   ├── 📁 handlers/            # HTTP endpoint handlers
  │   │   ├── 📄 products.py      # Product CRUD endpoints
  │   │   ├── 📄 search.py        # Search functionality
  │   │   └── 📄 __init__.py
  │   ├── 📁 models/              # Data models
  │   │   ├── 📄 product.py       # Product domain model
  │   │   └── 📄 __init__.py
  │   ├── 📁 metalang/            # lunch-metalang definitions
  │   │   ├── 📄 types.metal      # Type definitions using lunch-metalang
  │   │   └── 📄 contracts.metal  # API contracts and interfaces
  │   └── 📁 utils/
  │       ├── 📄 validation.py    # Input validation utilities
  │       └── 📄 __init__.py
  ├── 📁 tests/                   # Unit tests
  │   ├── 📄 test_products.py
  │   ├── 📄 test_search.py
  │   └── 📄 __init__.py
  ├── 📄 block.yaml               # Block metadata (OAM-like definition)
  ├── 📄 requirements.txt         # Python dependencies
  └── 📄 README.md                # Service documentation
  ```

- **Code editor (center, 75%)**: Monaco editor with full VSCode features
  - Proper syntax highlighting for Python, YAML, Markdown, and **lunch-metalang (.metal files)**
  - Click any file in tree → updates editor content with that file
  - Shows realistic service code using lunch-time SDK and lunch-metalang
  - Read-only in playground (demonstrates the pattern, not actual editing)
  - **VSCode-style tabs** at top showing open files (can have multiple files open)
  - **Breadcrumbs** showing current file path
  - **Line numbers**, **minimap**, and all Monaco editor features enabled

**Sample Code Pattern** (demonstrates lunch-idp abstractions with lunch-metalang):
```python
# product-catalog/src/main.py
"""
Product Catalog Service - Demonstrates lunch-idp's serverless developer experience.
Uses lunch-time SDK and lunch-metalang for type-safe, declarative microservice development.
"""
from lunch_time import Database, Cache, PubSub, Secrets, RPC, WorkloadsInfra
from lunch_time.rpc import service, endpoint
from lunch_time.observability import trace, metrics, span
from lunch_metalang import load_types, load_contracts
from typing import Optional
import asyncio

# Load lunch-metalang type definitions and contracts
ProductType = load_types("metalang/types.metal", "Product")
ProductContract = load_contracts("metalang/contracts.metal", "ProductService")

@service(
    name="product-catalog",
    port=8080,
    workloads_infra="eks-production",  # Deployed on EKS cluster
    health_check="/health",
    metrics_port=9090
)
class ProductCatalog:
    """
    Product catalog service running on EKS cluster.
    Platform handles infrastructure - developers focus on business logic.
    """
    
    def __init__(self):
        # lunch-time SDK provides tool-agnostic abstractions
        # Platform team can swap PostgreSQL→MySQL, Redis→Memcached without code changes
        self.db = Database("products-db")  # PostgreSQL service block
        self.cache = Cache("product-cache")  # Redis service block
        self.events = PubSub("product-events")  # Kafka service block
        self.stripe_key = Secrets.get("stripe-api-key")  # Vault integration
        
        # Reference to workloads infrastructure this service runs on
        self.workloads = WorkloadsInfra("eks-production")
    
    async def _on_startup(self):
        """Service startup hook"""
        # Initialize database schema using lunch-metalang types
        await self.db.migrate_schema(ProductType)
        self.logger.info(f"Service started on {self.workloads.name}")
    
    @endpoint("/products/{id}", methods=["GET"])
    @trace(operation="get_product")  # Automatic distributed tracing
    @metrics(counter="product_views", histogram="product_fetch_duration")
    async def get_product(self, id: str) -> ProductType:
        """
        Get product by ID with caching and pricing enrichment.
        Demonstrates READ-ONLY dependency on products-db and product-cache.
        """
        
        with span("cache_lookup"):
            # 1. Check cache first (Redis) - READ operation
            cached = await self.cache.get(f"product:{id}")
            if cached:
                self.logger.debug(f"Cache hit for product {id}")
                return ProductType.from_dict(cached)
        
        with span("database_query"):
            # 2. Fetch from database (PostgreSQL) - READ operation
            product = await self.db.query_one(
                "SELECT * FROM products WHERE id = $1",
                id,
                return_type=ProductType
            )
        
        if not product:
            raise NotFound(f"Product {id} not found")
        
        with span("payment_service_call"):
            # 3. Call payment service via lunch-rpc (inter-service communication)
            # This is a REQUEST/RESPONSE synchronous call, READ-ONLY dependency
            pricing = await RPC.call(
                service="payment-gateway",
                endpoint="/calculate-price",
                method="POST",
                payload={
                    "product_id": id,
                    "currency": "USD",
                    "customer_tier": "standard"
                },
                timeout=2.0,  # 2 second timeout
                retry={"max_attempts": 3, "backoff": "exponential"}
            )
        
        # 4. Enrich product data with pricing
        product.price = pricing["final_price"]
        product.currency = pricing["currency"]
        product.tax_rate = pricing["tax_rate"]
        
        with span("cache_write"):
            # 5. Update cache with TTL - WRITE operation to cache
            await self.cache.set(
                f"product:{id}",
                product.to_dict(),
                ttl=300  # 5 minutes
            )
        
        with span("event_publish"):
            # 6. Publish event (Kafka) - STREAMING, async fire-and-forget
            await self.events.publish(
                topic="product.viewed",
                event={
                    "product_id": id,
                    "timestamp": datetime.now().isoformat(),
                    "viewer_context": {"source": "api"}
                },
                partition_key=id  # Ensures order for same product
            )
        
        return product
    
    @endpoint("/products", methods=["POST"])
    @trace(operation="create_product")
    @metrics(counter="product_creations")
    async def create_product(self, data: dict) -> dict:
        """
        Create new product.
        Demonstrates WRITE dependency on products-db and STREAMING to Kafka.
        """
        
        # Validate against lunch-metalang contract
        ProductContract.validate_create_request(data)
        
        with span("database_insert"):
            # Insert into database - WRITE operation
            product_id = await self.db.execute(
                """
                INSERT INTO products (name, description, base_price, category, sku)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
                """,
                data["name"],
                data["description"],
                data["base_price"],
                data.get("category", "general"),
                data.get("sku", self._generate_sku())
            )
        
        with span("event_publish_created"):
            # Publish creation event - STREAMING
            await self.events.publish(
                topic="product.created",
                event={
                    "product_id": product_id,
                    "name": data["name"],
                    "created_at": datetime.now().isoformat(),
                    "created_by": "api"
                }
            )
        
        # Invalidate related caches - WRITE to cache
        await self.cache.delete("products:list:*")
        
        return {"id": product_id, "status": "created"}
    
    @endpoint("/products/{id}", methods=["PUT"])
    @trace(operation="update_product")
    async def update_product(self, id: str, data: dict) -> dict:
        """
        Update product - READ/WRITE dependency on database and cache.
        """
        
        # First read current state - READ
        current = await self.db.query_one(
            "SELECT * FROM products WHERE id = $1",
            id
        )
        
        if not current:
            raise NotFound(f"Product {id} not found")
        
        # Update - WRITE
        await self.db.execute(
            """
            UPDATE products
            SET name = $1, description = $2, base_price = $3, updated_at = NOW()
            WHERE id = $4
            """,
            data.get("name", current["name"]),
            data.get("description", current["description"]),
            data.get("base_price", current["base_price"]),
            id
        )
        
        # Invalidate cache - WRITE
        await self.cache.delete(f"product:{id}")
        
        return {"id": id, "status": "updated"}
    
    def _generate_sku(self) -> str:
        """Generate unique SKU"""
        import uuid
        return f"SKU-{uuid.uuid4().hex[:8].upper()}"
```

**lunch-metalang type definition** (`metalang/types.metal`):

```metal
// Product type definition using lunch-metalang
// Provides type safety and automatic validation across services

type Product {
    id: UUID;
    name: String(min=1, max=200);
    description: String(max=2000);
    base_price: Decimal(precision=10, scale=2);
    price: Decimal(precision=10, scale=2);  // Calculated field
    currency: CurrencyCode;  // ISO 4217
    tax_rate: Decimal(precision=5, scale=4);
    category: String;
    sku: String(pattern="^SKU-[A-Z0-9]{8}$");
    created_at: Timestamp;
    updated_at: Timestamp;
    metadata: Map<String, Any>;
}

type ProductListFilter {
    category?: String;
    min_price?: Decimal;
    max_price?: Decimal;
    search_term?: String;
    limit: Int(min=1, max=100) = 20;
    offset: Int(min=0) = 0;
}
```

**lunch-metalang contract** (`metalang/contracts.metal`):

```metal
// API contract for Product Service
// Defines endpoints, request/response types, and validation rules

contract ProductService {
    endpoint GET /products/{id: UUID} -> Product {
        errors: [NotFound, InvalidUUID];
        cache_ttl: 300;  // Cache for 5 minutes
        rate_limit: 1000 per minute;
    }
    
    endpoint POST /products {
        request: {
            name: String(min=1, max=200);
            description: String(max=2000);
            base_price: Decimal(precision=10, scale=2, min=0);
            category?: String;
            sku?: String;
        }
        response: {
            id: UUID;
            status: Enum["created", "pending"];
        }
        errors: [ValidationError, DuplicateSKU];
        auth_required: true;
    }
    
    endpoint PUT /products/{id: UUID} {
        request: Partial<Product>;  // All fields optional
        response: {
            id: UUID;
            status: Enum["updated"];
        }
        errors: [NotFound, ValidationError];
        auth_required: true;
    }
}
```

**Additional Service Example** (in feature branch, shows lunch-rpc usage):
```python
# recommendation-service/main.py (new in feature/add-recommendations branch)
from lunch_time import Database, RPC
from lunch_time.rpc import service, endpoint
from lunch_time.ai import Model  # Demonstrates AI integration

@service("recommendation-service", port=8081)
class RecommendationService:
    def __init__(self):
        self.db = Database("analytics-db")
        # Load ML model from artifact registry (abstraction over MLFlow/S3)
        self.model = Model("product-recommender-v2", version="1.5.0")
    
    @endpoint("/recommend/{user_id}", methods=["GET"])
    async def get_recommendations(self, user_id: str, limit: int = 5):
        """Get personalized product recommendations"""
        
        # Fetch user history via RPC call to product-catalog
        user_views = await RPC.call(
            service="product-catalog",
            endpoint="/users/{user_id}/history",
            payload={"user_id": user_id}
        )
        
        # Run ML model inference (handled by platform, no MLOps complexity)
        predictions = await self.model.predict({
            "user_id": user_id,
            "viewed_products": user_views,
            "limit": limit
        })
        
        return {"recommendations": predictions["product_ids"]}
```
**Features**:
- **Syntax Highlighting**: Monaco's built-in Python/Go/Rust support
- **IntelliSense/Autocomplete**: 
  - Typing `lunch_time.` shows SDK methods with documentation tooltips
  - Pre-loaded type definitions for `Database`, `Cache`, `RPC`, `PubSub`, `Secrets`, `Model`
  - Shows method signatures (e.g., `RPC.call(service: str, endpoint: str, payload: dict)`)
- **"Validate" Button**: Client-side linting
  - Checks Python syntax errors using Monaco's language services
  - Validates lunch-time SDK usage (e.g., warns if using undefined methods)
  - Shows inline red squiggles + error messages panel at bottom
  - Example validation: "Warning: RPC.call requires 'service' parameter"
- **"Close" Button**: Returns to main canvas (code changes not persisted in playground)
- **File Switching**: Click files in tree → updates editor content
- **block.yaml Viewer**: Shows OAM-like block definition
  ```yaml
  apiVersion: lunch.dev/v1
  kind: ServiceBlock
  metadata:
    name: product-catalog
    version: 1.2.0
  spec:
    language: python
    framework: fastapi
    dependencies:
      - name: products-db
        type: database
      - name: product-cache
        type: cache
    resources:
      cpu: 500m
      memory: 512Mi
    autoscaling:
      enabled: true
      minReplicas: 2
      maxReplicas: 10
  ```
- **Important**: No actual code execution - everything is static demonstration showing the lunch-idp developer experience

#### Left Sidebar (Blocks Palette)
**Sections** (collapsible):
1. **Services**: Drag-and-drop service templates
2. **Infrastructure**: PostgreSQL, Redis, Kafka, S3
3. **Pipelines**: ETL templates, event handlers

**Interaction**: 
- Drag item → drop on canvas → opens "Configure Block" modal for arguments
- All block configurations stored in client-side state (Zustand store)
- Changes are ephemeral (reset on page reload, or can be saved to browser localStorage)

#### Top Navigation Bar (Git Tree Simulation)
**Layout**: Horizontal timeline showing branches + commits
- Visual: `main ━━●━━●━━● ← HEAD` and below `feature/add-recommendations ━━●`
- Hovering commit shows tooltip: author, message, timestamp
- **Branch Switcher**: Dropdown to switch between `main` / `feature/add-recommendations`
  - Switching updates canvas to show different architecture
  - **Implementation**: Pre-defined snapshots stored as separate JSON state objects
    - `main-state.json`: 4 services configuration
    - `feature-branch-state.json`: 5 services configuration
  - Switching branches swaps the active state object (instant, no API calls)

**Architectural Diff View** (toggle button in top bar):

- When enabled, overlays diff visualization on canvas showing **side-by-side comparison**:
  - **Left Panel**: `main` branch architecture (baseline)
  - **Right Panel**: `feature/add-recommendations` branch (candidate)
  - **Split-screen** with synchronized scrolling and zooming
  - **Diff Highlighting**:
    - **Green nodes**: Added in current branch vs main
    - **Red nodes**: Removed vs main  
    - **Yellow outline**: Modified nodes
    - **Dependency arrows colored by change**:
      - Green dashed: New dependency added
      - Red dashed: Dependency removed
      - Orange: Dependency modified (type changed, e.g., read→read/write)
  - **Click modified node** → opens side-by-side code diff modal:
    - Left: `main` branch version of the file
    - Right: `feature` branch version
    - Uses Monaco Diff Editor (VSCode's native diff viewer)
    - Shows line-by-line changes with +/- highlighting
    - Can navigate through files in the service directory
    - Shows dependency type changes highlighted in comments
  - **Client-side diff computation**: JavaScript deep-diff library compares two state objects
- **Diff Summary Panel** (slides from top):
  - `+1 Service`, `-0 Services`, `~1 Modified`
  - `Cost Delta: +$45/month` (calculated from pre-defined cost metadata per block)
  - `New Dependencies: recommendation-ml-model (from artifact registry)`
  - `Dependency Changes:`
    - `product-catalog → recommendation-service: +RPC (Request/Response, Read-Only)`
    - `recommendation-service → analytics-db: +Database (Read/Write)`
  - All values computed on-the-fly from state comparison

#### Upper Toolbar (Quick Actions)

- **Open Sandbox** button → Opens sandbox environment for selected block(s)
  - **For Service/Service Blocks**: Launches interactive environment with:
    - Running instance of the service with mock data
    - API explorer (Postman-like interface) to test endpoints
    - Live logs showing request/response traces
    - Network graph showing dependencies being called in real-time
  - **For Infrastructure/Workloads Infrastructure Blocks**: Shows block "in action"
    - **EKS/EC2 Cluster**: Shows sample services deployed on top
      - Visual representation of pods/containers running
      - Resource utilization graphs (CPU, memory, network)
      - Sample services making requests to demonstrate the platform working
    - **PostgreSQL/Redis/Kafka**: Shows sample data and operations
      - Live query execution examples
      - Data visualization (tables, cache keys, message topics)
      - Performance metrics (queries/sec, cache hit rate, message throughput)
  - **Sandbox Modal Layout** (fullscreen overlay):
    - **Top Bar**: Block name, type badge, "Close Sandbox" button
    - **Left Panel (30%)**: Configuration and controls
      - Editable arguments (changes only apply in sandbox)
      - "Reset to Defaults" button
      - Sample data selector (e.g., "Load 1000 products", "Simulate high traffic")
    - **Center Panel (50%)**: Interactive visualization
      - For services: API request/response tester
      - For infrastructure: Live metrics dashboard
      - Real-time activity log at bottom
    - **Right Panel (20%)**: Metrics and status
      - Resource usage (CPU, memory, network)
      - Health status
      - Performance stats (latency percentiles, throughput)
  - **Sample Data**: Pre-generated realistic scenarios
    - E.g., For `product-catalog`: 1000 sample products with realistic attributes
    - E.g., For `EKS cluster`: 5 sample services running with simulated traffic
  - **Interaction**: Users can trigger sample requests and see responses
    - Click "Simulate Load Test" → shows animated graph of increasing traffic
    - Click "Test Endpoint" → sends request, shows trace through dependencies
- **View Dependencies Graph** (button): Switches canvas to dependency-flow mode
  - Arrows show RPC calls and data flow between services
  - **Dependency Type Legend** (bottom-right corner):
    - 🔵 Read-Only (solid blue arrow)
    - 🔴 Write (solid red arrow)
    - 🟣 Read/Write (solid purple bidirectional arrow)
    - 📡 Request/Response (solid line with small circles at ends)
    - 📊 Streaming (dashed line with flow animation)
  - Click arrow → tooltip shows:
    - Source service → Target service
    - Dependency type (Read-Only, Write, Read/Write)
    - Communication pattern (Req/Res or Streaming)
    - Endpoint/topic name
    - Sample payload structure
  - **Example**:
    - `product-catalog → products-db`: Read/Write, Request/Response, Queries: `SELECT/INSERT/UPDATE`
    - `product-catalog → payment-gateway`: Read-Only, Request/Response, RPC: `/calculate-price`
    - `order-service → product-events`: Write, Streaming, Topic: `product.viewed`
- **Export as OAM YAML** (button): Downloads architecture definition
  - Client-side YAML generation using `js-yaml` library
  - Triggers browser download of generated file (no server required)

---

### 2.2 lunch-hub: Block Marketplace

**VSCode Extension Display**: Opens in fullscreen mode by default (can be split-screened with editor).

#### Landing Page
**Layout**: Grid of block cards (3 columns on desktop, responsive)

**Filter Sidebar** (left, 20%):
- **Type**: Checkboxes for Services / Infrastructure / Pipelines
- **Category**: API Gateway, Database, Cache, ML, Authentication, etc.
- **Language**: Python, Java, Go, Rust
- **Popularity**: Sort by downloads / stars
- **Search Bar** (top): Fuzzy search by name/description
  - **Client-side filtering**: All 15-20 blocks loaded from static JSON
  - Uses Fuse.js for fuzzy searching (fast, no backend needed)
  - All filters applied via JavaScript array operations

**Block Card** (inspired by HuggingFace model cards):

- **Header**: Block type badge (🔷 Concrete / 🔶 Custom / ⬜ Virtual) + Block icon + name
- **Block Type Indicator**: Visual badge showing Concrete/Custom/Virtual prominently
- **Author/Publisher**: "@lunch-official" or community usernames
- **Stats**: ⭐ 234 stars, 📥 1.2k downloads
- **Tags**: `database`, `sql`, `ha-ready`, `backup-enabled`, block type (`concrete`, `custom`, `virtual`)
- **Short Description**: 1-sentence summary (truncated at 60 chars)
- **"View Details" button** and **"Open Sandbox" button**

#### Block Detail Page (modal or new route)
**Layout**: 
- **Left Panel (60%)**:
  - **Overview Tab**:
    - Full description (markdown rendered)
    - Visual architecture diagram (if service/pipeline): embedded mini node-graph
    - Example usage code snippet (in Monaco editor, read-only)
  - **Arguments Tab**:
    - Table: Name | Type | Required | Default | Description
    - Example: `db_name` | `string` | ✅ | `mydb` | "Database name"
  - **Dependencies Tab**:
    - List of required blocks (e.g., PostgreSQL service needs PostgreSQL infra)
    - Dependency graph visualization (nested blocks)
  - **Changelog Tab**: Version history with diffs

- **Right Panel (40%)**:
  - **Quick Actions**:
    - "Add to Workspace" (downloads OAM YAML in playground context)
      - Generates YAML client-side and triggers download
    - "Preview in Sandbox" (opens mini lunch-cycle canvas with just this block)
      - Creates temporary state with single block, opens in modal
  - **Metadata Box**:
    - Version: `v2.3.1`
    - License: `Apache 2.0`
    - Languages: Python, Go
    - Kubernetes: `>=1.28`
    - All metadata from static JSON definitions
  - **Related Blocks** (carousel): "Users also use..."
    - Pre-defined relationships in block metadata (tags/categories based)

#### Sample Blocks (20+ pre-loaded, demonstrating marketplace diversity):

**Custom Blocks** (composite blocks - blocks of blocks, 2 blocks):

1. **E-commerce Platform** - Complete e-commerce system in a box
   - **Type**: 🔶 Custom (Composite)
   - Tags: `e-commerce`, `platform`, `composite`, `custom`
   - **Internal Blocks** (arguments that are blocks):
     - `product-catalog` service (concrete)
     - `order-service` service (concrete)
     - `payment-gateway` service (concrete)
     - `notification-service` service (concrete)
     - PostgreSQL database (concrete)
     - Redis cache (concrete)
     - Kafka message broker (concrete)
     - EKS cluster (concrete - workloads infra where services run)
   - **Exposed Interface**: REST API endpoints for products, orders, payments
   - **Configuration Arguments**: 
     - `enable_recommendations`: boolean (adds recommendation service if true)
     - `payment_provider`: enum (stripe, paypal, square)
     - `notification_channels`: array (email, sms, push)
   - Languages: Python (services), Configuration (composition)
   - Description: "Deploy a complete e-commerce platform with one block. Internally composed of microservices, databases, and infrastructure, but exposed as a single configurable unit."
   - Cost: $310/month (sum of all internal blocks)

2. **Observability Stack** - Complete monitoring and logging solution
   - **Type**: 🔶 Custom (Composite)
   - Tags: `observability`, `monitoring`, `logging`, `composite`, `custom`
   - **Internal Blocks**:
     - Prometheus (metrics collection) - concrete
     - Grafana (visualization) - concrete
     - Loki (log aggregation) - concrete
     - Jaeger (distributed tracing) - concrete
     - AlertManager (alerting) - concrete
     - PostgreSQL (metadata storage) - concrete
     - EKS cluster (workloads infra) - concrete
   - **Exposed Interface**: Grafana dashboards, alerting webhooks
   - **Configuration Arguments**:
     - `retention_days`: number (7-365)
     - `alert_channels`: array (slack, pagerduty, email)
     - `scrape_interval`: duration (10s-5m)
   - Languages: Configuration (composition)
   - Description: "Full observability stack as a single block. Configure and deploy, internally manages all the complexity."
   - Cost: $280/month

**Service Blocks** (application-level, concrete atomic blocks, 8 blocks):

1. **API Gateway** - Kong-based reverse proxy with rate limiting
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `networking`, `gateway`, `rate-limiting`, `concrete`
   - Dependencies: None (entry point)
   - Languages: Configuration-based
   - Cost: $25/month
2. **Authentication Service** - Keycloak integration with OAuth2/OIDC
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `auth`, `security`, `oauth2`, `oidc`, `concrete`
   - Dependencies: PostgreSQL (for user data)
   - Languages: Java wrapper
   - Cost: $40/month
3. **Payment Processor** - Stripe/PayPal integration facade
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `payments`, `stripe`, `paypal`, `fintech`, `concrete`
   - Dependencies: Secrets (API keys), Redis (idempotency)
   - Languages: Python, Go
   - Cost: $30/month
4. **Notification Service** - Multi-channel notifications (email, SMS, push)
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `notifications`, `email`, `sms`, `sendgrid`, `twilio`, `concrete`
   - Dependencies: Kafka (event-driven), Secrets
   - Languages: Python
   - Cost: $20/month
5. **Recommendation Engine** - ML-powered product/content recommendations
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `ml`, `recommendations`, `ai`, `tensorflow`, `concrete`
   - Dependencies: Redis (caching), S3 (model storage), PostgreSQL (analytics)
   - Languages: Python
   - Cost: $85/month (GPU instance)
6. **File Upload Service** - Multipart upload handler with virus scanning
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `storage`, `upload`, `security`, `antivirus`, `concrete`
   - Dependencies: S3 (storage), Kafka (events)
   - Languages: Go
   - Cost: $15/month
7. **Search Service** - ElasticSearch/OpenSearch wrapper
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `search`, `elasticsearch`, `full-text`, `concrete`
   - Dependencies: Elasticsearch cluster
   - Languages: Python, Java
   - Cost: $60/month
8. **Analytics Collector** - Event tracking and aggregation
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `analytics`, `tracking`, `metrics`, `concrete`
   - Dependencies: Kafka (ingestion), PostgreSQL (storage)
   - Languages: Go, Rust
   - Cost: $35/month

**Infrastructure Blocks** (backing services, concrete atomic blocks, 9 blocks):

1. **PostgreSQL 16 HA Cluster** - Production-ready with replication
   - **Type**: 🔷 Concrete (Atomic)
   - Tags: `database`, `sql`, `postgresql`, `ha`, `concrete`
   - Config: replicas (1-5), backup_enabled, storage_size
   - Cost: $120/month (3 replicas)
2. **Redis 7 Cache** - In-memory cache with persistence
   - Tags: `cache`, `redis`, `in-memory`
   - Config: max_memory, persistence_enabled, eviction_policy
   - Cost: $45/month
3. **Kafka Message Broker** - Event streaming platform
   - Tags: `messaging`, `kafka`, `streaming`, `event-driven`
   - Config: partitions, replication_factor, retention_hours
   - Cost: $90/month (3-node cluster)
4. **S3-Compatible Storage (MinIO)** - Object storage
   - Tags: `storage`, `s3`, `object-storage`, `minio`
   - Config: storage_size, versioning_enabled
   - Cost: $30/month (500GB)
5. **Elasticsearch 8 Cluster** - Full-text search engine
   - Tags: `search`, `elasticsearch`, `logs`
   - Config: nodes, shards, replicas
   - Cost: $150/month (3-node cluster)
6. **MongoDB 7** - Document database
   - Tags: `database`, `nosql`, `mongodb`, `document`
   - Config: replicas, sharding_enabled
   - Cost: $100/month
7. **Neo4j Graph Database** - Graph data modeling
   - Tags: `database`, `graph`, `neo4j`, `relationships`
   - Config: memory_size, apoc_enabled
   - Cost: $80/month
8. **RabbitMQ** - Message queue broker
   - Tags: `messaging`, `rabbitmq`, `queue`, `amqp`
   - Config: queues, exchanges, vhosts
   - Cost: $40/month
9. **Vault (HashiCorp)** - Secrets management
   - Tags: `secrets`, `vault`, `security`, `encryption`
   - Config: auto_unseal, kv_version
   - Cost: $25/month

**Pipeline Blocks** (data processing, 3 blocks):
1. **CSV-to-Database ETL** - Batch import pipeline
   - Tags: `etl`, `batch`, `csv`, `import`
   - Dependencies: S3 (source), PostgreSQL (destination)
   - Languages: Python (Pandas)
   - Cost: $10/month (scheduled runs)
2. **Real-time Analytics Stream** - Kafka→PostgreSQL streaming
   - Tags: `streaming`, `analytics`, `real-time`, `kafka`
   - Dependencies: Kafka (source), PostgreSQL (sink)
   - Languages: Python (Flink), Java
   - Cost: $50/month
3. **ML Model Training Pipeline** - Scheduled model retraining
   - Tags: `ml`, `training`, `kubeflow`, `gpu`
   - Dependencies: S3 (data + models), PostgreSQL (metadata)
   - Languages: Python (TensorFlow, PyTorch)
   - Cost: $200/month (GPU-intensive)

---

### 2.3 lunch-observe: Observability & PR Review

**VSCode Extension Display**: Opens in fullscreen mode by default, showing the same node graph visualization as lunch-cycle with additional observability overlays.

#### Main View: System Monitoring Dashboard with Graph Visualization

**Layout**:

- **Center Canvas (70%)**: Interactive node graph (same as lunch-cycle)
  - Shows the same service/infrastructure/workloads infra block architecture
  - **Overlays for Observability**:
    - **Latency Profiling Overlay** (toggle button: "Show Latency"):
      - Each node shows live latency metrics (p50, p95, p99)
      - Color-coded by performance: Green (<50ms), Yellow (50-200ms), Orange (200-500ms), Red (>500ms)
      - Arrows between nodes show RPC call latencies
      - Animated pulses on arrows indicate active traffic flow
      - Click node → detailed latency breakdown by endpoint
    - **Cost Profiling Overlay** (toggle button: "Show Cost"):
      - Each node shows estimated monthly cost
      - Size of node scales with cost (larger = more expensive)
      - Color-coded by cost tier: Green (<$50), Yellow ($50-$200), Orange ($200-$500), Red (>$500)
      - Hover node → cost breakdown (compute, memory, storage, network)
      - Total system cost displayed in top-right corner
    - **Dependency Flow Visualization**:
      - Same arrows as lunch-cycle showing Read-Only, Write, Read/Write, Request/Response, Streaming
      - Arrows animated with traffic flow (particles moving along path)
      - Thickness of arrow indicates traffic volume
      - Click arrow → shows request rate, data volume, latency distribution
  - **Graph Modes** (toggle buttons in toolbar):
    - "Normal View" - Standard architecture view
    - "Latency Heat Map" - Nodes colored by latency
    - "Cost Heat Map" - Nodes colored/sized by cost
    - "Traffic Flow" - Animated view showing request paths

- **Right Panel (30%)**: Metrics and tabs
  - **Top Section**: System-wide KPIs
    - Total Requests/sec
    - Average Latency (p95)
    - Error Rate
    - Total Monthly Cost
  - **Bottom Section**: Tabbed interface (Logs, Traces, PR Review)

**Tab 1: Logs Explorer**

- **Filters** (top bar):
  - Service dropdown (multi-select)
  - Log level: INFO / WARN / ERROR
  - Time range: Last 5m / 1h / 24h / Custom
  - Search: Regex pattern matching (client-side regex)
- **Log Stream** (virtualized list for performance):
  - Each row: `[timestamp] [service] [level] message`
  - Click row → expands to show full trace context (request ID, stack trace if error)
  - **Click log entry** → highlights corresponding node on graph and shows trace path
  - "Live tail" toggle (simulates streaming logs)
    - **Implementation**: Pre-generated 1000+ log entries in static JSON
    - "Live tail" uses setInterval to append logs from the array progressively
    - All filtering done client-side via array filter/map operations

**Tab 2: Traces & Profiling**

- **Graph Integration**: Shows trace path overlaid on node graph
  - Click trace → highlights service path on graph with animated flow
  - Shows timing at each hop along the path
- **Trace Timeline** (Gantt-like chart below graph):
  - Horizontal bars showing request flow across services
  - Example: `API Gateway (20ms) → Product Catalog (35ms) → Database (50ms)`
  - Click bar → shows detailed span info (arguments, return values)
  - **Latency Breakdown**: Shows time spent in each service + network overhead
  - **Sample Data**: 20-30 pre-generated trace objects with realistic timings
  - Rendered using D3.js or Recharts (client-side visualization)
- **Flamegraph** (for performance bottlenecks):
  - Visual: stacked bars showing function call time distribution
  - Hovering shows function name + execution time
  - **Sample Data**: Pre-generated flamegraph data structure (JSON hierarchy)
  - Interactive visualization using D3.js flame graph library
- **Cost Profiling Per Request**:
  - Shows estimated cost per request based on resource usage
  - Breakdown: Compute time, DB queries, cache operations, network egress
  - Highlights most expensive operations in the trace
  - Example: "This request cost $0.0023 (DB: $0.0015, Compute: $0.0008)"

**Tab 3: PR Review & Diff**

**Layout**: Split-screen comparison with **dual node graphs**

- **Left Pane (50%)**: `main` branch system
  - Full node graph showing current architecture (from `main-state.json`)
  - **Latency overlay** showing baseline performance
  - **Cost overlay** showing current costs
  - Mocked "live" metrics from baseline system (randomized within realistic ranges)
  - Key metrics displayed: Avg latency, error rate, cost/request
- **Right Pane (50%)**: `feature/add-recommendations` branch
  - Full node graph with diff highlighting (green = new, yellow = modified)
  - **Latency overlay** showing new performance (with improvements highlighted)
  - **Cost overlay** showing new costs (with increases/decreases highlighted)
  - Mocked "live" metrics from candidate system (slight variations showing improvement)
  - Key metrics displayed with **delta indicators** (↑↓) compared to main
- **Synchronized Interaction**:
  - Hover node in one pane → highlights corresponding node in other pane
  - Zoom/pan synchronized between both graphs
  - Click node → shows side-by-side comparison of metrics
- **Diff Stats Panel** (bottom, collapsible):
  - **Performance Comparison**:
    - Latency: `-15ms p95` (70ms → 55ms)
    - Throughput: `+120 req/s` (450 → 570 req/s)
    - Error Rate: `-0.3%` (0.5% → 0.2%)
  - **Cost Comparison**:
    - Monthly Cost: `+$45/month` ($320 → $365)
    - Cost per Request: `-$0.0001` (optimization despite new service)
    - Most expensive new component: `recommendation-service ($45/mo)`
  - **Code Changes**: `+450 lines`, `-20 lines`
  - **Architectural Changes**:
    - ➕ Added `recommendation-service`
    - ✏️ Modified `product-catalog` (added RPC call to recommendations)
    - ➕ New dependency: `product-catalog → recommendation-service (Read-Only, Request/Response)`
  - **All metrics**: Pre-calculated and stored in branch metadata (no real computation)

**Interactive Probing** (button: "Probe System"):
- Opens request builder (like Postman mini):
  - Method: GET / POST
  - Endpoint: `/products/123`
  - Body: JSON editor (Monaco in JSON mode)
  - "Send to Main" vs "Send to PR Branch" buttons
- Shows side-by-side response comparison + trace timeline
  - **Implementation**: Pre-defined request/response pairs in static JSON
    - Example: `GET /products/123` → maps to `responses.main.products123.json`
    - Different responses for main vs PR branch
  - Simulated latency (setTimeout 500-2000ms) for realism
  - Trace timeline generated from response metadata (service call chain)

#### Replay Debugger (Advanced Feature Highlight)
- **Time-Travel Panel**: 
  - Slider to select past timestamp (last 1 hour of simulated traffic)
  - "Replay from this point" button
- **Action**: Canvas reloads showing system state at that time
  - Logs/traces filtered to selected window
  - Breakpoint markers (visual only in playground, tooltips explain full feature)
  - **Implementation**: Pre-generated snapshots at 5-minute intervals
    - Snapshots include: logs subset, metrics, active requests
    - Slider moves through snapshot array
    - UI updates instantly by swapping displayed data (no computation)

---

## 3. User Flow Examples

### Flow 1: First-Time Exploration (lunch-hub → lunch-cycle)
1. User lands on **lunch-hub** marketplace
2. Browses services, filters by "API" category
3. Clicks "API Gateway" block → sees detail page with code example
4. Clicks "Preview in Sandbox" → opens lunch-cycle canvas with just API Gateway node
5. Drags PostgreSQL from left sidebar → connects to API Gateway
6. Clicks API Gateway node → opens mini-IDE → sees sample authentication code
7. Switches to `feature/add-recommendations` branch in git tree
8. Sees new "Recommendation Service" node appear (green highlight)

### Flow 2: Understanding Microservice Communication (lunch-cycle focus)
1. User on lunch-cycle main canvas (MicroMart system loaded)
2. Clicks `order-service` node → "Open Code Editor"
3. Sees code using `lunch_time.RPC.call("payment-gateway", "/charge", {...})`
4. Closes mini-IDE, clicks "View Dependencies Graph" in toolbar
5. Canvas switches to flow mode: arrows from order-service → payment-gateway (labeled "RPC: /charge")
6. Clicks arrow → tooltip shows RPC endpoint signature and sample payload

### Flow 3: Comparing Architectures (lunch-observe PR review)
1. User on lunch-observe tab
2. Clicks "PR Review & Diff" tab
3. Sees split-screen: main (4 services) vs PR branch (5 services)
4. Reads diff stats: "+1 service, +$45/month, -15ms latency"
5. Clicks "Probe System" → sends GET /products/123 to both
6. Sees response time: main=85ms, PR=70ms (recommendation service prefetches data)
7. Views trace timeline showing new parallel RPC call path

---

## 4. UI/UX Design Principles

### Visual Language (HuggingFace-inspired)
- **Color Palette**:
  - Primary: Vibrant blue (#3B82F6) for actions
  - Success: Green (#10B981) for healthy/added
  - Warning: Amber (#F59E0B) for modified
  - Danger: Red (#EF4444) for errors/removed
  - Neutral: Gray scale for backgrounds
- **Typography**: Inter font family (modern, readable)
- **Spacing**: Generous padding (16-24px) to avoid clutter
- **Icons**: Lucide React or Heroicons (consistent set)

### Interactivity
- **Hover States**: All clickable elements show subtle elevation/color change
- **Loading States**: Skeleton screens for async operations (not spinners)
- **Tooltips**: Context-sensitive help on hover (gear icon = "Configure block arguments")
- **Animations**: Smooth transitions (300ms) for panel slides, node additions

### Accessibility
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: ARIA labels on all icons/buttons
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)

---

## 5. Technical Implementation Notes

### Data Structure (All Client-Side)
```typescript
// Example data structure embedded in the app
interface SystemState {
  branch: 'main' | 'feature/add-recommendations';
  services: Service[];
  infrastructure: Infrastructure[];
  pipelines: Pipeline[];
}

interface Block {
  id: string;
  name: string;
  type: 'service' | 'infrastructure' | 'pipeline';
  version: string;
  code?: string; // Full code content for services
  arguments: Record<string, any>;
  dependencies: string[]; // IDs of dependent blocks
  metadata: {
    cpu: string;
    memory: string;
    monthlyCost: number; // For cost delta calculation
  };
}

// All stored in TypeScript modules imported at build time
export const mainBranchState: SystemState = { /* ... */ };
export const featureBranchState: SystemState = { /* ... */ };
export const blocks: Block[] = [ /* 15-20 marketplace blocks */ ];
export const sampleLogs: LogEntry[] = [ /* 1000+ log entries */ ];
export const sampleTraces: Trace[] = [ /* 30 trace timelines */ ];
```

### Data Mocking Strategy
- **Block Marketplace**: 15-20 static JSON objects with full metadata
- **Git Simulation**: Two complete state snapshots (main, feature branch)
- **Logs**: 1000+ pre-generated log entries with realistic timestamps/messages
- **Metrics**: Time-series arrays (last 60 minutes, 1-minute granularity)
- **Traces**: 30 pre-defined request traces with realistic service call chains
- **RPC Responses**: Map of endpoint → mocked response objects
- **Code Files**: Full service code stored as template literals in TypeScript

### Client-Side Libraries
- **State Diff**: `deep-diff` or custom comparator for architectural diffs
- **YAML Generation**: `js-yaml` for exporting OAM definitions
- **Fuzzy Search**: `fuse.js` for marketplace search
- **Visualization**: D3.js for flamegraphs, Recharts for timeline charts
- **Code Editor**: Monaco Editor (same as VS Code)
- **Node Graph**: React Flow for drag-and-drop canvas
- **Date Handling**: `date-fns` for timestamp formatting

### Performance Optimization
- **Virtualized Lists**: `react-window` for logs (handles 10k+ entries smoothly)
- **Code Splitting**: Lazy load Monaco Editor (~3MB) only when needed
- **Debounced Search**: 300ms delay on hub marketplace filter
- **Memoization**: React.memo for expensive node rendering
- **Bundle Size**: Target <2MB initial bundle (excluding Monaco)

### Deployment (100% Static)
- **Build Output**: Pure HTML/CSS/JS files
- **Hosting Options**: 
  - GitHub Pages (free)
  - Vercel/Netlify (free tier)
  - AWS S3 + CloudFront
  - Any static file CDN
- **No Server Required**: Everything runs in browser
- **Assets**: Block icons, screenshots bundled or loaded from public CDN
- **Offline Capable**: Can be PWA with service worker caching

---

## 6. Out-of-Scope (for Playground)

- **No Backend**: Zero server-side components or APIs
- **No Real Code Execution**: Services run in mock mode with pre-defined responses
- **No Real Deployment**: Kubernetes deployment is simulated visually only
- **No Authentication**: Anonymous access, no user accounts
- **No Persistent State**: All interactions ephemeral (resets on reload)
  - Optional: Can save to browser localStorage for session continuity
- **No Real Git**: Branch switching is state swapping, not actual git operations
- **No External Integrations**: No connections to Datadog, GitHub, Kubernetes, etc.
- **No Dynamic Code Generation**: lunch-metalang code generation not included
- **No Real Metrics**: All metrics are pre-generated sample data with simulated updates
- **No Network Calls**: Everything loads from bundled static assets

---

## 7. Success Metrics

**Engagement**:
- Time on page: >5 minutes average
- Interaction rate: >70% click on service mini-IDE
- Feature discovery: >50% users visit all 3 modules

**Comprehension** (post-session survey):
- "I understand lunch-idp's block-based approach": >80% agree
- "I see how this improves over current tools": >70% agree
- "I'd recommend this to my team": >60% NPS

**Conversion**:
- Email signup rate: >15% (optional modal for "Export Architecture" or "Request Full Demo")
- Demo request rate: >5%

---

## 8. Implementation Plan: Incremental Development Approach

### Philosophy: Iterative Delivery with Working Milestones

Build incrementally, shipping a working (albeit limited) demo at each phase. Each milestone should be deployable and demonstrate core value.

---

### **PHASE 0: Project Setup & Foundation** (2-3 days)

**Goal**: Have a deployable "Hello World" with VSCode mockup and basic navigation

**Tasks**:

1. **Project Initialization**
   - [ ] Initialize Vite + React + TypeScript project
   - [ ] Set up folder structure: `/src/components`, `/src/data`, `/src/pages`, `/src/types`, `/src/store`
   - [ ] Install core dependencies: `react`, `react-dom`, `react-router-dom`, `zustand`, `tailwindcss`
   - [ ] Configure Tailwind CSS with VSCode Dark+ theme colors
   - [ ] Set up ESLint + Prettier

2. **VSCode UI Shell**
   - [ ] Create `<VSCodeLayout>` component with dark theme
   - [ ] Implement title bar, menu bar (static, non-functional)
   - [ ] Create left activity bar with 3 icons (lunch-cycle, lunch-hub, lunch-observe)
   - [ ] Add status bar at bottom
   - [ ] Style everything to look like VSCode Dark+ theme

3. **Basic Routing**
   - [ ] Set up React Router with 3 routes: `/cycle`, `/hub`, `/observe`
   - [ ] Create placeholder pages for each module (just "lunch-cycle", "lunch-hub", "lunch-observe" text)
   - [ ] Wire activity bar icons to switch routes

4. **Deploy MVP**
   - [ ] Set up GitHub Actions or Vercel deployment
   - [ ] Deploy to production URL
   - [ ] Verify it loads and navigation works

**Deliverable**: VSCode-themed shell with working navigation between 3 empty modules

---

### **PHASE 1: Minimal lunch-cycle (Graph Visualization)** (1 week)

**Goal**: Show a static architecture graph with clickable nodes

**Tasks**:

1. **Install React Flow**
   - [ ] `npm install reactflow`
   - [ ] Create `<ArchitectureCanvas>` component wrapper around React Flow
   - [ ] Style nodes to match spec (green for services, cyan for service blocks, purple for workloads infra)

2. **Create Static Data Model**
   - [ ] Define TypeScript types in `/src/types/index.ts`:
     - `Block`, `ServiceBlock`, `InfrastructureBlock`, `WorkloadsInfraBlock`
     - `SystemState`, `Dependency`
   - [ ] Create `/src/data/blocks.ts` with 4 sample blocks:
     - `product-catalog` (service, concrete)
     - `products-db` (PostgreSQL service block, concrete)
     - `eks-production` (workloads infra, concrete)
     - Simple dependencies between them
   - [ ] Create `/src/data/systemStates.ts` with `mainBranchState` containing the 4 blocks

3. **Render Graph**
   - [ ] Convert block data to React Flow nodes format
   - [ ] Position nodes in a simple layout (manual coordinates for now)
   - [ ] Render nodes with:
     - Block name
     - Block type badge (🔷 Concrete, 🔶 Custom, ⬜ Virtual)
     - Color-coded by block category
   - [ ] Add edges showing dependencies (arrows between nodes)

4. **Basic Interactivity**
   - [ ] Click node → log to console (prepare for properties panel)
   - [ ] Hover node → show subtle highlight
   - [ ] Pan and zoom canvas (built into React Flow)

**Deliverable**: Static graph showing 4 blocks with visual dependencies, clickable nodes

---

### **PHASE 2: Node Properties Panel** (3-4 days)

**Goal**: Click a node and see its properties in a sidebar

**Tasks**:

1. **Properties Panel UI**
   - [ ] Create `<PropertiesPanel>` component (slides in from right)
   - [ ] Show when a node is selected, hide when clicking canvas
   - [ ] Display block properties:
     - Name, version, type, description
     - Arguments (key-value list)
     - Dependencies (list with icons)
     - Metadata (cost, resources, health status)

2. **Zustand Store**
   - [ ] Create `/src/store/usePlaygroundStore.ts`
   - [ ] State: `selectedBlock`, `systemState`, `currentBranch`
   - [ ] Actions: `selectBlock`, `deselectBlock`, `switchBranch`

3. **Wire Everything Together**
   - [ ] Click node → update `selectedBlock` in store
   - [ ] Properties panel reads from `selectedBlock`
   - [ ] Click canvas background → clear selection

**Deliverable**: Clicking nodes shows properties sidebar with metadata

---

### **PHASE 3: Service Mini-IDE (Monaco Editor)** (4-5 days)

**Goal**: Open a modal with code editor when clicking service block

**Tasks**:

1. **Install Monaco Editor**
   - [ ] `npm install @monaco-editor/react`
   - [ ] Set up code splitting to lazy-load Monaco (large bundle)

2. **Sample Code Data**
   - [ ] Create `/src/data/codeExamples.ts`
   - [ ] Add sample Python code for `product-catalog` service (from spec)
   - [ ] Include file tree structure data (main.py, handlers/, models/, etc.)

3. **Mini-IDE Modal**
   - [ ] Create `<ServiceIDEModal>` component (80% viewport size)
   - [ ] Left sidebar: File tree (simple folder/file list)
   - [ ] Right: Monaco editor with Python syntax highlighting
   - [ ] Click file → load code into editor
   - [ ] "Close" button → dismiss modal

4. **Integration**
   - [ ] Add "Open Code Editor" button to properties panel (for service blocks only)
   - [ ] Click button → open modal with service's code

**Deliverable**: Service blocks can open modal showing realistic Python code with file tree

---

### **PHASE 4: Dependency Visualization** (2-3 days)

**Goal**: Show colored arrows indicating dependency types (read/write, req/res, streaming)

**Tasks**:

1. **Enhanced Edge Rendering**
   - [ ] Update edge data model to include dependency type
   - [ ] Create custom edge components with:
     - Color coding (blue=read, red=write, purple=read/write)
     - Line style (solid=req/res, dashed=streaming)
     - Arrow markers
   - [ ] Add dependency types to sample data

2. **Dependency Legend**
   - [ ] Create `<DependencyLegend>` component (bottom-right corner)
   - [ ] Show color/line style meanings
   - [ ] Toggle visibility

3. **Interactive Edge Details**
   - [ ] Click edge → show tooltip with:
     - Source → Target
     - Dependency type
     - Communication pattern
     - Sample endpoint/topic

**Deliverable**: Graph shows color-coded dependency arrows with types and tooltips

---

### **PHASE 5: Git Branch Switching** (3-4 days)

**Goal**: Switch between main and feature branch to see architecture changes

**Tasks**:

1. **Branch Data**
   - [ ] Extend `/src/data/systemStates.ts` with `featureBranchState`
   - [ ] Add `recommendation-service` block to feature branch
   - [ ] Modify `product-catalog` to have new dependency in feature branch

2. **Git Tree UI**
   - [ ] Create `<GitTreeBar>` component (top of canvas)
   - [ ] Show branch selector dropdown (main / feature/add-recommendations)
   - [ ] Visual timeline representation

3. **Branch Switching Logic**
   - [ ] Store action: `switchBranch(branchName)`
   - [ ] Reload graph with new state when branch changes
   - [ ] Smooth transition animation

4. **Diff Highlighting**
   - [ ] Compare current branch vs main
   - [ ] Highlight new nodes in green
   - [ ] Highlight modified nodes with yellow outline
   - [ ] Show diff stats in top bar (+1 service, ~1 modified)

**Deliverable**: Can switch between branches and see visual diff of architecture changes

---

### **PHASE 6: Side-by-Side Diff View** (2-3 days)

**Goal**: Show main and feature branch side-by-side with synchronized interaction

**Tasks**:

1. **Split-Screen Layout**
   - [ ] Create `<DualGraphView>` component
   - [ ] Left panel: main branch graph
   - [ ] Right panel: feature branch graph
   - [ ] Toggle button to switch between single/dual view

2. **Synchronized Interaction**
   - [ ] Hover node in one panel → highlight corresponding node in other
   - [ ] Sync zoom and pan (optional, can be independent)
   - [ ] Click node → show properties for that version

3. **Diff Stats Panel**
   - [ ] Bottom panel showing:
     - Services added/removed/modified
     - Dependency changes
     - Cost delta (if metadata includes costs)

**Deliverable**: Side-by-side branch comparison with visual diff highlighting

---

### **PHASE 7: Minimal lunch-hub (Block Marketplace)** (4-5 days)

**Goal**: Browse a catalog of blocks with search and filters

**Tasks**:

1. **Marketplace Data**
   - [ ] Create `/src/data/marketplaceBlocks.ts`
   - [ ] Add 10-15 sample blocks with metadata:
     - Name, description, type, tags, author, stats
     - Include 2 custom (composite) blocks from spec

2. **Grid Layout**
   - [ ] Create `<MarketplaceGrid>` component
   - [ ] Block cards showing:
     - Type badge, icon, name, author
     - Tags, stars, downloads
     - Short description
   - [ ] Responsive grid (3 cols desktop, 2 tablet, 1 mobile)

3. **Search & Filters**
   - [ ] Install `fuse.js` for fuzzy search
   - [ ] Search bar with debounced input
   - [ ] Filter sidebar:
     - Block type checkboxes
     - Category tags
   - [ ] Client-side filtering logic

4. **Block Detail Modal**
   - [ ] Click card → open detail modal
   - [ ] Tabs: Overview, Arguments, Dependencies
   - [ ] "Open Sandbox" button (disabled/tooltip for now)

**Deliverable**: Searchable marketplace grid with block detail modals

---

### **PHASE 8: Block Sandbox Preview** (3-4 days)

**Goal**: Click "Open Sandbox" on a block to see it in action

**Tasks**:

1. **Sandbox Modal**
   - [ ] Create `<SandboxModal>` component (fullscreen)
   - [ ] For service blocks:
     - Simple API endpoint list
     - Mock request/response viewer
     - Simulated logs
   - [ ] For infrastructure blocks:
     - Visual representation (e.g., database icon with sample tables)
     - Metrics dashboard (mocked)

2. **Sample Interactions**
   - [ ] Pre-defined request/response pairs
   - [ ] "Test Endpoint" button → show mocked response
   - [ ] Animated "loading" state for realism

3. **Integration**
   - [ ] Wire "Open Sandbox" button in block detail modal
   - [ ] Load appropriate sandbox view based on block type

**Deliverable**: Blocks can be previewed in sandbox with mock interactions

---

### **PHASE 9: Minimal lunch-observe (Logs & Traces)** (4-5 days)

**Goal**: Show system observability with logs, traces, and graph overlay

**Tasks**:

1. **Observability Data**
   - [ ] Create `/src/data/logs.ts` with 100+ sample log entries
   - [ ] Create `/src/data/traces.ts` with 10+ sample traces
   - [ ] Add latency/cost metadata to blocks

2. **Graph with Overlays**
   - [ ] Reuse `<ArchitectureCanvas>` from lunch-cycle
   - [ ] Add overlay modes:
     - "Show Latency" → color nodes by latency (green/yellow/red)
     - "Show Cost" → size nodes by cost
   - [ ] Animated traffic flow on edges (particles)

3. **Logs Tab**
   - [ ] Install `react-window` for virtualized list
   - [ ] Create `<LogsExplorer>` component
   - [ ] Filters: service, log level, time range, search
   - [ ] Click log → highlight corresponding node on graph

4. **Traces Tab**
   - [ ] Create `<TracesViewer>` component
   - [ ] Gantt-chart style timeline (use Recharts or custom SVG)
   - [ ] Click trace → highlight service path on graph
   - [ ] Show latency breakdown

**Deliverable**: Observability view with graph overlays, logs, and trace visualization

---

### **PHASE 10: PR Review Comparison** (3-4 days)

**Goal**: Side-by-side comparison with performance/cost metrics

**Tasks**:

1. **Dual Graph in Observe**
   - [ ] Reuse `<DualGraphView>` component
   - [ ] Left: main branch with baseline metrics
   - [ ] Right: feature branch with new metrics
   - [ ] Both showing latency/cost overlays

2. **Metrics Comparison Panel**
   - [ ] Bottom stats panel showing:
     - Latency delta (p95)
     - Cost delta (monthly)
     - Throughput change
     - Error rate change
   - [ ] Color-coded improvements/regressions

3. **Interactive Probing**
   - [ ] "Probe System" button
   - [ ] Simple request builder (endpoint selector, method)
   - [ ] "Send to Main" vs "Send to PR" buttons
   - [ ] Side-by-side response comparison

**Deliverable**: PR review view comparing architectures with metrics

---

### **PHASE 11: Polish & Enhancements** (1 week)

**Goal**: Make it production-ready and delightful

**Tasks**:

1. **UI/UX Polish**
   - [ ] Smooth transitions and animations
   - [ ] Loading states for all async operations
   - [ ] Empty states with helpful messages
   - [ ] Error boundaries
   - [ ] Responsive design testing

2. **Accessibility**
   - [ ] Keyboard navigation (Tab, Enter, Escape)
   - [ ] ARIA labels on all interactive elements
   - [ ] Screen reader testing
   - [ ] Color contrast verification (WCAG AA)

3. **Performance Optimization**
   - [ ] Code splitting (lazy load Monaco, D3.js)
   - [ ] Memoize expensive computations (React.memo, useMemo)
   - [ ] Optimize bundle size (analyze with webpack-bundle-analyzer)
   - [ ] Add loading skeletons

4. **Documentation**
   - [ ] Add inline tooltips/help text
   - [ ] "What is this?" info buttons
   - [ ] Optional onboarding tour (e.g., using `react-joyride`)

5. **Testing**
   - [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
   - [ ] Mobile responsiveness testing
   - [ ] Performance testing (Lighthouse)

**Deliverable**: Polished, accessible, performant demo ready for users

---

### **PHASE 12: Advanced Features (Optional)** (1-2 weeks)

**Goal**: Add "wow" features if time permits

**Tasks**:

1. **lunch-metalang Syntax Highlighting**
   - [ ] Create custom Monaco language definition for `.metal` files
   - [ ] Add syntax highlighting rules
   - [ ] Basic autocomplete for lunch-metalang types

2. **Advanced Diff View**
   - [ ] Monaco Diff Editor for side-by-side code comparison
   - [ ] Highlight dependency changes in code comments

3. **Flamegraph Visualization**
   - [ ] Integrate D3.js flamegraph library
   - [ ] Show performance profiling in traces tab

4. **Export Functionality**
   - [ ] Export architecture as OAM YAML (using `js-yaml`)
   - [ ] Export as PNG/SVG (use html2canvas or React Flow export)
   - [ ] Share URL with encoded state

5. **Time-Travel Replay**
   - [ ] Implement time-travel slider in lunch-observe
   - [ ] Show historical system states
   - [ ] Animate transitions between snapshots

**Deliverable**: Advanced features that showcase cutting-edge capabilities

---

## Development Timeline Summary

| Phase | Duration | Cumulative | Key Deliverable |
|-------|----------|------------|-----------------|
| Phase 0 | 2-3 days | 3 days | VSCode shell with navigation |
| Phase 1 | 1 week | 10 days | Static architecture graph |
| Phase 2 | 3-4 days | 14 days | Node properties panel |
| Phase 3 | 4-5 days | 19 days | Service code viewer with Monaco |
| Phase 4 | 2-3 days | 22 days | Dependency visualization |
| Phase 5 | 3-4 days | 26 days | Git branch switching |
| Phase 6 | 2-3 days | 29 days | Side-by-side diff |
| Phase 7 | 4-5 days | 34 days | Block marketplace |
| Phase 8 | 3-4 days | 38 days | Sandbox preview |
| Phase 9 | 4-5 days | 43 days | Observability (logs/traces) |
| Phase 10 | 3-4 days | 47 days | PR review comparison |
| Phase 11 | 1 week | 54 days | Polish & production-ready |
| Phase 12 | 1-2 weeks | 68 days | Advanced features (optional) |

**Minimum Viable Demo**: Phase 0-6 (29 days / ~6 weeks) - Working lunch-cycle with graph, properties, code viewer, and branch comparison

**Full Featured Demo**: Phase 0-11 (54 days / ~11 weeks) - All 3 modules with polish

**Complete Vision**: Phase 0-12 (68 days / ~14 weeks) - Everything including advanced features

---

## Team Recommendations

**Option 1: Solo Developer**
- Focus on Phases 0-6 first (MVP lunch-cycle)
- Then add Phase 7-8 (marketplace)
- Polish continuously throughout

**Option 2: 2 Developers**
- Dev 1: Phases 0-6 (lunch-cycle)
- Dev 2: Phases 7-8 (lunch-hub) + data preparation
- Both: Phases 9-11 together (observability + polish)
- Timeline: ~8-10 weeks to full featured demo

**Option 3: 3 Developers + Designer**
- Dev 1: lunch-cycle (Phases 1-6)
- Dev 2: lunch-hub (Phases 7-8)
- Dev 3: lunch-observe (Phases 9-10)
- Designer: VSCode theme, icons, UX polish throughout
- Timeline: ~6-7 weeks to full featured demo

---

## Technology Stack (Confirmed)

**Core**:
- React 18 + TypeScript
- Vite (build tool)
- React Router (navigation)
- Zustand (state management)
- Tailwind CSS (styling)

**Visualization**:
- React Flow (graph canvas)
- Recharts (charts/timelines)
- D3.js (flamegraphs - optional Phase 12)

**Code Editor**:
- @monaco-editor/react (VSCode editor)

**Utilities**:
- fuse.js (fuzzy search)
- js-yaml (YAML export)
- date-fns (date formatting)
- react-window (virtualized lists)

**Dev Tools**:
- ESLint + Prettier
- TypeScript strict mode
- Vite bundle analyzer

---

## Success Criteria

**After Phase 6 (MVP)**:
- [ ] Can view architecture graph with 4+ blocks
- [ ] Can click nodes to see properties
- [ ] Can open service code in Monaco editor
- [ ] Can switch between git branches
- [ ] Can see visual diff between branches
- [ ] Deploys as static site to production URL

**After Phase 11 (Full Featured)**:
- [ ] All 3 modules (cycle, hub, observe) functional
- [ ] Can browse marketplace and preview blocks in sandbox
- [ ] Can view logs, traces with graph integration
- [ ] Can compare PR branches with metrics
- [ ] Accessible (keyboard nav, ARIA labels)
- [ ] Fast (<3s initial load, <100ms interactions)
- [ ] Mobile responsive

---

## Risk Mitigation

**Risk**: Monaco Editor bundle size (3MB+)
- **Mitigation**: Code-split and lazy-load only when needed

**Risk**: React Flow performance with many nodes
- **Mitigation**: Start with <20 nodes, use clustering if expanding

**Risk**: Scope creep during development
- **Mitigation**: Stick to phase boundaries, ship working demo at each phase

**Risk**: Design inconsistency with VSCode
- **Mitigation**: Use VSCode theme colors, reference real VSCode screenshots

**Risk**: Data complexity for realistic examples
- **Mitigation**: Create data templates early, reuse across all modules

---

**Next Step**: Begin Phase 0 - Set up project and VSCode shell
