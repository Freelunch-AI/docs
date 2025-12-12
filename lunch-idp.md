# lunch-idp: Internal Developer (Backend) Platform inside VSCode

**Overview:** `lunch-idp` is an ecossystem of plugins and CLIs that transforms VSCode into a fully fledged Internal Developer Platform (IDP) with serverless and lego block experience — no more context switching, no more ops integration work, no more distributed debugging hustles, no more ping fatigue, no more slow development cycles, no more fragile code in prod, no more uncecessary costs.

**Analogy:** `lunch-idp`  is like a modern Spring Boot. For the declarative, visual, multi-language, platform engineering, gitops and AI-native age.

**Ideal Customer Profile (ICP):** Backend-related software teams at Scale-ups.

**Problem:** Scale-ups have multiple projects, muliple tools, multiple teams, scaling needs, rising costs, rising customer expectations and security requirements that require carefull software engineering infrastrusctucture to standardize, guardrail, simplify, empower and avoid duplicate work of developers, enabling them to stay productive in this highly complex, messy and high stakes environment.

---

## 🦄 Unicorn Potential (Market Size)

We target **~46k companies** (proxy: number of companies using *Azure DevOps*) at a conservative **20 users/company** and **10% being premium plans** on average. At **$60/dev/month** for the premium plan: **~$662M ARR**, firmly unicorn territory.

---

## ❓ **Why `lunch-idp`  instead of building an IDP in-house?**

Companies that build sucessfull IDPs (e.g., *Mercado Libre, Stone, Sicredi*) took around 5 years to provide a product their developers love, and they still need to keep maintaining and improving the platform with a 10+ people platform engineering team.

With **`lunch-idp`** can get up and running in a week and leave platform maintanance and improvement to us. You will also get features that no other IDPs (to our knowledge) have like: building systems as composing programmable/configurable lego blocks; or aligning tech KPIs with Business KPIs via causal inference.

Since we are open-core, you can always open an issue or PR in our repo, if you need some feature the platform doesn’t provide. 

Also, there is no lock-in, everything is done via monorepo and gitops, so in worst case scenario, you leave the platform with an organized end-to-end template.

---

## ❓ Why **`lunch-idp`  instead of other products?**

- **Notable open-source/source-available alternatives**
    - *Kubevela: doesn’t provide serverless experience, doesn’t provide app-level lego block experience, doesn’t provide microservice framework, not an IDP (lacks portal, dev environments, infra management and artifacts manegement).* Ideal as the Kubernetes Deploy component of an IDP.
    - *Rainbond:* no proper english documentation or community, *doesn’t provide microservice framework. Not built as modular plugins to ease adoption.*
    - *Erda:* no proper english documentation or community, doesn’t support *Rust* and *Python. Not built as modular plugins to ease adoption.*
    - Caprover, Coolify: don’t work on top of Kubernetes*, don’t provide app-level lego block experience, don’t provide microservice framework, not an IDP (lacks RBAC, portal, dev environments, infra management and artifacts manegement).* Ideal for personal projects.
    - Hashicorp Waypoint: *Got dicontinuated. Doesn’t* *provide app-level lego block experience, doesn’t provide microservice framework, not an IDP (lacks RBAC, portal, dev environments, infra management and artifacts manegement)*
- **Notable closed-source alternatives**
    - *Railway, Render, Digital Ocean, Fly.io:* closed-source, expensive, lock you in. D*on’t provide app-level lego block experience, doesn’t provide microservice framework, not an IDP (lacks multi-cloud, dev environments, infra management and artifacts manegement).* Ideal for personal projects or MVPs.
    

---

## ❓ Mercado Livre tried selling their IDP (Fury) and it din’t work out, why will **`lunch-idp`  be different?**

*Fury* suffered 2 main problems when being selled to other companies:

- Big companies couldnt integrate with their existing ops stack easily: we solve this via our tool-agnostic model and backstage-like easy to use plugin to put multiple external dashboard in a single pane of glass.
- Medium companies couldn’t afford it: we solve this via our open-core model where most of the value is source-available and we charge for additionals.

---

## ❓ For AI teams, how does it compare to platforms like *Ray* and *Skypilot***?**

- **Similarity:** both make training and deploying AI models on k8s easy. `lunch-idp` can use *Ray* or *SkyPilot*  under the hood for the training part.
- **What makes them not ideal for deploying services:** they don’t offer modern DevOps features (e.g., tool switching, GitOps under the hood, dev/stage/prod environments, online experimentation, etc) like *Kubevela* does
- **Best Use:** the best is to *Ray* or *SkyPilot* as distributed training clusters attached to your notebooks and used via their respective SDKs. They can be changed with a single click with `lunch-idp`. You should use `lunch-idp` as the platform where services are built, deployed and monitored, powered by AI models obained from distributed training (get models from artifact registry). This is the best option because it doesn’t treat AI Engineering as completetely separate area, it treats as an extension of the Software Engineering Lifecycle. This enables standardization, best practices, compliance, rapid delivery and operations to be organization-wide under the same base platform.

---

## 👀 Features of `lunch-idp`

- **Core features**
    - **Open core**: most of lunch-idp is source-available, allowing free usage and internal modifications
    - **Modular architecture**: lunch-idp itself is not a monolith, it is an ecosystem of IDE plugins, CLIs, Backstage Plugin, Web Apps and Desktop App that work seamlessy together, and a lot of these modules can also be used as standalone products.
    - **Structures the software development lifeycle** for the age of AI-assisted engineering
    - Makes building and debugging distributed systems **as easy as composing lego blocks** and **building and debugging single-threaded local code,** providing **the Serverless experience for developers** that can focus on application-level code and **don’t need to know docker, terraform, kubernetes, AWS, etc**
    - Provides **high-level declarative abstractions, but still lets engineers do everything they are used to doing** and is **agnostic to which libraries are used within workloads**
    - Provides **production**-**ready to use SDKs for common needs** (e.g., database, secrets, auth, etc)
    - Enables **validating everything locally on a virtual cluster** before running on an actual cluster.
    - Combines **the best of modern cloud native tools in a single place**, while allowing for engineers to **switch the tools that are used under the hood**.
    - Provides a super friendly **eject option** that exports an organized and documented codebase with gitops.
    - Is highly flexible, being **multi-language, multi-cloud and with different deployment options** for teams in diffferent maturity levels
    - Proves a **marketplace** with reusable building blocks for code, infra, plugins, policies, macros (widgets) and templates.
    - Provides cluster and services **auto-scaling** and services **scale-to-zero** (while allowing custom scheduled inits for to avoid cold-start for predictable spikes)
    - Provides support for **Local Dev** → **Remote** **Dev → Integration Testing → Staging → Production** environment progression
    - Provides reproducible **dev containers** with ready acess to Dev services, with local/remote switch and that can be turned off and on maintaining the last state.
    - **Isolated (but mergeble) workspaces** for each dev team
    - Provides **interactive PR previews** where you can compare the main branch’s system working and the PR branch’s system working, with profiling and the diffs highlighted in green and red. You can observe and interact with both of them. You get semantic diff stats like: cost delta, microservices added/removed/updated, etc.
- **More features**
    - Provides **alignment between tech and business KPIs**
    - Provides **built-in node-based IDE tailored for test-driven microservice development.**
    - Unifies the worlds of **DevOps and MLOps/LLMOps** and **provides offline and online experimentation support.**
    - Guarantees effective async communication and real-time colllaboration, **eliminating ping fatigue**
    - Provides an **AutoML framework** for optimizing software systems without code modification
    - Everything (spec, docs, code, infra, data, artifacts, config, platform actions, macros (widgets), policies) is versioned or tracked, **nothing is lost after change.**
    - Provides a **services catalog** for discovering, understanding and requesting/gaining access to available external services (third-part services or APIs made by other teams inside the company)
    - Provides **automatic Linux Updates for production nodes** via automatic version bumping and blue-green pattern with state restoration
    - Provides support for **embedded device nodes** (Linux-based devices or Microcontrollers)

---

## 🦴 Fundamental OSS dependencies that power `lunch-idp`

### **Tool-agnosticism**

`lunch-idp` embraces the modern wave of being tool-agnostic (like these tools: *OpenTelemetry, Meshery, Dapr, ZenML, Kubevela, Beam, dbt, bytebase*). `lunch-idp` does this via Codegen at build time for build-time tools like *Terraform* and via Sidecar Containers at runtime for runtime tools like *PostgreSQL*. This means 2 things:

- Stable high-level interfaces for everything outside of application code. Benefits:
    - Developers don’t need to learn multiple tools
    - Developers don’t need to know a lot of best practices for each tool, mostly already built-in the interface.
    - Developers don’t need to have sgnificant low-level expertise
- Enables Platform Engineers/DevOps Engineers to switch the underlying tools. Benefits:
    - Engineers can integrate with tools they are already using and maybe paying with long-term contracts
    - Engineers switch to a tool that now has better performance
    - Engineers switch to a tool that now has better support
    - Engineers switch to a tool that now has lower cost

### **Dependencies**

- **Fixed Dependencies** (either tool-agnostic tools (e.g., Dapr, Kubevela), alternative tools are not services that would require integration (e.g., Crossplane, Ansible), users dont care which tools are used for that purpose (e.g., Keycloak, React))
    - Local Development
        - *Kubernetes-in-Docker*
        - *LocalStack*
    - Tool-agnostic Supporting SDKs/APIs for Microservice Applications
        - *Dapr*
    - Tool-agnostic DAG Builder
        - *ZenML*
    - Auto-containairization
        - *Cloud-native Buildpacks*
    - Kubernetes Deploy
        - *Kubevela*
    - Meta Service Mesh
        - *Meshery*
    - Telemetry
        - *Open Telemetry*
        - *Open Lineage*
    - Dashboard Unifier
        - *Backstage*
    - Frontend Framework
        - *React*
    - Artifact Reproducibility
        - *Git*
        - *LakeFS*
    - Database GitOps
        - *ByteBase*
    - Databse Migrations
        - *Alembic*
    - Authorization
        - *Keycloak*
    - Cluster Setup
        - *Ansible*
    - IaC
        - *Crossplane*
    - Workloads Clusters Management
        - *Rancher*
    - Kubernetes Policies
        - *Kyverno*
    - Embedded Devices as Kubernetes Nodes
        - *KubeEdge*
- **Interchangebale Dependencies (Being tool-agnostic)**
    - SSO: *Keycloak / Okta / Microsoft Entra ID / OneLogin / Auth0*
    - Clusters: *Openstack / AWS / GCP / Azure / Oracle*
    - Workloads Clusters: *Kubernetes / Open Cluster management / EKS / GKS / AKS*
    - CI/CD (*Kubevela* does this job for us)*: Github Actions / GitLab CI / Jenkins / Circle CI*
    - Monitoring & Observability (*OpenTelemetry* does this job for us): *Prometheus / Zabbix / New Relic / DynaTrace / SigNoz /  Zipkin / Jaeger / DataDog / Splunk / Elastic*
    - Dev Environments: *Devspace / Okteto / Telepresence / Gitpod / Tilt / Coder / Che / Daytona / Devbox*
    - Service Meshes (*Meshery* does this job for us): *Istio / Linkerd / Cilium / Consul*
    - Notebooks: *Marimo /* JupyterLab
    - Distributed Training Cluster: *Ray / SkyPilot / DeepSpeed / Pytorch / JAX / Kubeflow Trainer*
    - Container Image Registries: *Harbor / Quay / Docker Hub / ECR / ACR / GAR / GitHub Container Registry / GitLab Container Registry*
    - Workflow Orchestrators (*ZenML* does this job for us): *Airflow / Argo / Kubeflow Pipelines / Prefect / Temporal / Flyte / Dagster / Kestra / Dagger*
    - Supporting Services (*Dapr* helps with this)
        - Databases: *PostgreSQL / MySQL / MongoDB / Cassandra / Redis / Neo4j*
        - Secrets Vaults: *Hascorpo Vault / Infisical / AWS Secrets Manager / Azure Key Vault*
        - Message Brokers: *Kafka / NATS / RabbitMQ / Redis PubSub*
        - Authentication & Authorization: *Keycloak / Authelia / Authentik / Auth0 / OKTA*
        - Background Jobs: *Celery / Redis Queue*
        - LLM Gateways: *LiteLLM / OpenRouter / Semantic Router*
        - LLM Context/Memory: *Mem0 / Zep / Letta*
        - Artifact Registries: *MLFlow, Aim, Minio, S3*
        - Data Transformation (*Beam* and *dbt* help with this): *Spark / Flink / Iceberg+S3 / SnowFlake / BigQuery*

---

## 🦥 `lunch-idp` Ecossystem

`lunch-idp` itself is not a monolith, it is a set of modular pieces that work well together cathering all the personas involved in building and improving backends. Some modules can work by themselves (self-contained). These pieces are IDE Plugins, CLIs, Backstage Plugin, Wb Apps and Desktop App.

### Recommended Teams Structure

- Vertical teams
    - **Platform Team** (work on `lunch-back` outside the platform or using previous platform version)
        - PM
        - Platform Backend Team
            - Platform Engineer
            - SRE (does low-level observability of platform)
            - Staff/Lead Engineer
            - Data Engineer
        - Platform Frontend Team (work outside the platform)
            - Platform Engineer
            - Frontend Engineer
            - Staff/Lead Engineer
    - **Applied Teams** (Each team works on a separate workspace)
        - Developer
        - Staff/Lead Engineer
        - DevOps Engineer (does deploy reviews of applied systems)
        - SRE (does low-level observability of applied systems itself)
        - PM
        - Data Engineer
        - (Optional) MLE/AI/LLM/GenAI Engineer (builds system-specific AI-powered blocks)
        - (Optional) Data/ML/AI/Agent Scientist (builds system-specific AI Artifacts)
    - XaaS Teams (Each team works on a separate workspace) (e.g., Infrastrcture-as-a-service, Databases-as-a-service, LMs-as-a-service, Secrets-as-a-service, Workflow Orchestrator-as-aservice, etc)
        - SWE
        - Staff/Lead Engineer
        - DevOps Engineer (does deploy reviews of X)
        - SRE (does low-level observability of X)
        - PM
        - (Optional) MLE/AI/LLM/GenAI Engineer (publishes cross-system AI-powered virtual blocks)
        - (Optional) Data Engineer
- Horizontal teams
    - Security & Compliance Team
    - (Optional) Test Coverage Team (QA)
    - (Optional) Performance Team
    - (Optional) Scalability Team
    - (Optional) Maintainability Team
    - (Optional) Cost Team
    

New Definitions:

- **Horizontal Engineers:** Engineers that work across projetcs optimizing some aspect of the code. Horizontal Engineers can do:
    - feature optimization steps across multiple product features
    - review deployment artifacts
    - find problems and bottlenecks in blocks or systems in async fashion
- **XaaS Engineers:** Engineers in a separate vertically-specialized team working on providing a specific capability as a service available for consumption via platform (e.g., CloudStack as a service), these teams just use the block building part of the platform (make virtual blocks available in the private block registry).

## Modules

**Just for Platform Engineers and Horizontal Engineers:**

- Just for Platform Engineer Admins
    
    [[Source-available] [dev + ops modes] [declarative] Admin Front — lunch-admin: ide-plugin for admins to manage the lunch ecossystem](https://www.notion.so/Source-available-dev-ops-modes-declarative-Admin-Front-lunch-admin-ide-plugin-for-admins-t-2a26e257a4ce8098ae90ddff4a295fd6?pvs=21)
    
- For all Platform Engineers and Security and Compliance Horizontal Engineers
    
    [[Source-available] [dev mode] [declarative] Platform Front — lunch-platform: ide plugin, for seeing changelog of the lunch ecossytem, checking modifications that need to be done to install new version, install new version via blue-green pattern to avoid dangers, rollback versions, changing platform-level configs, Browse/Search Audit Logs, Monitor DORA Metrics, Get Platform Usage Analytics, Send Notifications to Applied Personas, Cusotmize Theme with company Colors and Logo, Configura which types of changes dont need to go through integration testing and staging (e.g., changing a specific AI model or ETL Pipeline without changing their signatures)](https://www.notion.so/Source-available-dev-mode-declarative-Platform-Front-lunch-platform-ide-plugin-for-seeing-c-2a26e257a4ce800c9f3df6542aed3d63?pvs=21)
    
- For all Platform Engineers all Horizontal Engineers
    
    [[Source-available] [dev mode] [declarative] CI/CD Front — lunch-cicd: ide plugin, extend default ci/cd pipeline](https://www.notion.so/Source-available-dev-mode-declarative-CI-CD-Front-lunch-cicd-ide-plugin-extend-default-ci-c-2a26e257a4ce80b3b8dcc5e88b2b2acb?pvs=21)
    
    [
    [Freemium] [dev mode] [declarative] [self-contained] Infra Front — lunch-infra: ide plugin, i**nfra experimentation playground. C**reate, deploy dummy workloads, evaluate, track and destroy ephemeral infra
    
    ](https://www.notion.so/Freemium-dev-mode-declarative-self-contained-Infra-Front-lunch-infra-ide-plugin-infra-exp-2a36e257a4ce8051a812ff7820c66063?pvs=21)
    

**Just for Applied Personas and Horizontal Engineers:**

- Just for Developers/SWEs, Lead/Staff Engineers, PMs (read-only) and Performance, Scalability, Refactoring and Cost Horizontal Engineers
    
    [[Source-available] [dev mode] [declarative] [self-contained] Runtime Front — lunch-time: cli, multi-language microservice runtime framework, Dapr on steroids](https://www.notion.so/Source-available-dev-mode-declarative-self-contained-Runtime-Front-lunch-time-cli-multi-l-27e6e257a4ce80febf63d00acfb57774?pvs=21)
    
    [[Source-available] [dev mode] [declarative] [self-contained] Build Front — lunch-metalang: cli, multi-language microservice build-time framework](https://www.notion.so/Source-available-dev-mode-declarative-self-contained-Build-Front-lunch-metalang-cli-multi-27d6e257a4ce801abb8ac046a15f0018?pvs=21)
    
- Just for Developers/SWEs, DevOps Engineers, Lead/Staff Engineers, PMs (read-only), SREs and Performance, Scalability, Refactoring and Cost Horizontal Engineers
    
    [[Source-available] [dev + ops modes] [declarative] [self-contained] Full Cycle Front — lunch-cycle: ide plugin for multi-language microservices lifecycle](https://www.notion.so/Source-available-dev-ops-modes-declarative-self-contained-Full-Cycle-Front-lunch-cycle-i-2a16e257a4ce80feb8d4cc762e393510?pvs=21)
    
- Just for Data/AI Scientists and Lead/Staff Engineers
    
    [[Source-available] [dev mode] [imperative] [self-contained] AI Artifacts Front — lunch-artifact: ide plugin, notebook-based, for experimenting, building, tracking, publishing to Artifact Registry and promoting artifacts to PROD. the AI Artifacts: datasets, prompts, models, inference req/res pipelines, agent definition packs. Contains 3 main GUIs: artifact registry, notebooks and data annotation.](https://www.notion.so/Source-available-dev-mode-imperative-self-contained-AI-Artifacts-Front-lunch-artifact-ide--2a26e257a4ce806bbbccea76b7885086?pvs=21)
    
- Just for Data Engineers, Lead/Staff Engineers, PMs (read-only) and Performance, Scalability, Refactoring and Cost Horizontal Engineers
    
    [[Source-available] [dev + ops modes] [declarative] [self-contained] DAGs Front — lunch-dags: ide plugin for building, testing, debugging, profiling, deploying/scheduling and monitoring/observing DAGs (tool-agnostic)](https://www.notion.so/Source-available-dev-ops-modes-declarative-self-contained-DAGs-Front-lunch-dags-ide-plug-2a26e257a4ce80d9aac4d74f446b444a?pvs=21)
    
    [[Source-available] [dev + ops modes] [declarative] [self-contained] Message Broker Front — lunch-broker: ide plugin to visuallize, query data, create/update messages schemas and monitoring/observing topics and messages](https://www.notion.so/Source-available-dev-ops-modes-declarative-self-contained-Message-Broker-Front-lunch-brok-2a26e257a4ce80fd98a6d152843dc13d?pvs=21)
    
    [[Source-available] [dev + ops modes] [declarative] [self-contained] Store Front — lunch-db: ide plugin to visualize, query data, create, update storage and database systems schemas visually. doesnt not allow breaking changes unless a proper migration is setup](https://www.notion.so/Source-available-dev-ops-modes-declarative-self-contained-Store-Front-lunch-db-ide-plugi-2a26e257a4ce80d6942be1adc5db2e12?pvs=21)
    
    [[Source-available] [dev + ops modes] [declarative] [self-contained] Big Data Front — lunch-data: ide plugin to visualize data, build, test, debug, profile, deploy and monitor/observe ETL, ELT or Streaming pipelines](https://www.notion.so/Source-available-dev-ops-modes-declarative-self-contained-Big-Data-Front-lunch-data-ide--2a26e257a4ce807ab074dba5ed2b03e7?pvs=21)
    
- Just for Security, Compliance Horizontal Engineers, PMs (read-only) and Lead/Staff Engineers
    
    [[Freemium] [dev + ops modes] [imperative] [needs discover or cycle] Security Front — lunch-sec: ide plugin, reviewing and read-teaming systems, blocks and AI artifacts in search of vulnerabilities](https://www.notion.so/Freemium-dev-ops-modes-imperative-needs-discover-or-cycle-Security-Front-lunch-sec-ide-p-2a26e257a4ce8046ba62f4f858471567?pvs=21)
    
- For all applied Personas, Horizontal Engineers and Lead/Staff Engineers
    
    [[Source-available] [dev + ops mode] [imperative] [self-contained] External Dashboards Front — lunch-external: ide plugin, single place that puts the GUIs of your external Ops tools together as widgets. For teams still using external tools like Jira, Datadog, Airflow, etc. Can be seen as a simplified Backstage.](https://www.notion.so/Source-available-dev-ops-mode-imperative-self-contained-External-Dashboards-Front-lunch-e-2a36e257a4ce80899d45c89f505f484e?pvs=21)
    

**Just for Engineers (including MLEs, Lead/Staff and XaaS Engineers), Developers and PMs (read-only):**

[[Source-available] [dev mode] [imperative] [needs lunch-hub] Block Front — lunch-block: ide-plugin & backstage plugin. For developing, testing, evaluating, documenting and publishing reusable building blocks (of infra, workloads infra, services, MCPs, tasks, event handlers and evals); one at a time. Also do discovery: discover internal & external AI Artifact and Blocks. Also build and publish policies and templates. Also see external library guidance: mandatory, encouraged, disincouraged and prohibited libraries organized per domain](https://www.notion.so/Source-available-dev-mode-imperative-needs-lunch-hub-Block-Front-lunch-block-ide-plugin--2a26e257a4ce809da8a5de0292b98737?pvs=21)

[[Freemium] [dev mode] [declarative] [self-contained] Marketplace Front — lunch-hub: web app, HuggingFace Hub for Software Engineering. Find and download reusable and composable building blocks (infra, workloads infra services, tasks, pipelines), policies (restrict what cna be done in hte platform) and add-ons (allow users to take advantage of tool-specific code by writing dirrectly to the codebase if needed)](https://www.notion.so/Freemium-dev-mode-declarative-self-contained-Marketplace-Front-lunch-hub-web-app-HuggingF-2a86e257a4ce806fa0fde68e321f5a4c?pvs=21)

[[Freemium] [dev mode] [imperative] [needs metalang] Robustness Front - lunch-chaos: ide plugin, chaos engineering playground, inject faults in your system to evaluate how observable and resiliant your system is, track experiments](https://www.notion.so/Freemium-dev-mode-imperative-needs-metalang-Robustness-Front-lunch-chaos-ide-plugin-chaos-2a26e257a4ce807a8806f8e380793b08?pvs=21)

[[Source-available] [dev mode] [declarative] [self-contained] Dev Environment Front — lunch-env: ide plugin. Setup VPN. Create, manage, enter and switch dev environments. Also check services the dev environment can reach.](https://www.notion.so/Source-available-dev-mode-declarative-self-contained-Dev-Environment-Front-lunch-env-ide-p-2a36e257a4ce801ca4fed06a36ea559b?pvs=21)

[[Source-available] [dev mode] [read-only] [needs cycle] Linting Front — lunch-lint: ide plugin, shows linting errors when codebase doesnt follow the lunch structure (which makes the other plugins not work)](https://www.notion.so/Source-available-dev-mode-read-only-needs-cycle-Linting-Front-lunch-lint-ide-plugin-shows-2a36e257a4ce803ca93bcb6ab39f6489?pvs=21)

[[Source-available] [dev mode] [imperative] [self-contained] Migration Front — lunch-migrate: cli, Import Spring or .NET project and get AI Assistant for migrating existing systems and codebases to the lunch ecossystem, following blue-green pattern to avoid dangers](https://www.notion.so/Source-available-dev-mode-imperative-self-contained-Migration-Front-lunch-migrate-cli-Imp-2a36e257a4ce8072b050ff200b18ce3f?pvs=21)

[[Source-available] [dev + ops modes] [declarative] [needs metalang] Observability & PR Review Front — lunch-observe: ide plugin to low-level monitoring, analyze logs, replay the dev or prod system from a point in time (if dev system, then loads prod’s system point-in-time state), debug with breakpoints, visualize block internals, get lineage of artifacts, analyze profiling bottlenecks (performance and cost),  & traces. Can also deploy a mirror of your prod system to an ephemeral cluster and probe it there. PR Reviews compare the prod system to the candidate one, both in staging and can be probed.](https://www.notion.so/Source-available-dev-ops-modes-declarative-needs-metalang-Observability-PR-Review-Front--2a26e257a4ce80068cbbcc90a3d2e36f?pvs=21)

**For all Personas (including PMs)**

[[Freemium] [dev + ops mode] [declarative] [self-contained] Project Management & AI-assisted Engineering Front — lunch-vibekill: ide plugin, for project management & ai-assisted engineering](https://www.notion.so/Freemium-dev-ops-mode-declarative-self-contained-Project-Management-AI-assisted-Engineeri-2a16e257a4ce809b8bdfd77fa1739345?pvs=21)

[[Source-available] [ops mode] [read-only] [needs cycle] Leadership Front — lunch-leader: web app, read-only portal where anyone can understand the projects being done, the cost involved in each project, see aduti logs, teams in each project, visualize the systems in production, technologies used, etc](https://www.notion.so/Source-available-ops-mode-read-only-needs-cycle-Leadership-Front-lunch-leader-web-app-rea-2a36e257a4ce80238be8fda9b26c70bb?pvs=21)

[[Freemium] [ops mode] [declarative] [self-contained] Developer Bottleneck Front — lunch-bottleneck: desktop app, spawns periodic pop-ups where devs choose the activity they are doing at the moment, this generates activity analytics reports for managers and platform teams, which allows identificaiton of developer bottlenecks that should be addressed (with infra, capacitation and/or team processes). ](https://www.notion.so/Freemium-ops-mode-declarative-self-contained-Developer-Bottleneck-Front-lunch-bottleneck-d-2a56e257a4ce806cb82af01b3e804c3f?pvs=21)

---

Features that span all plugins:

- `lunch-core` deamon provides shared state, authn/authz integrated with SSO tools, git commands and coomunicates with `lunch-back` (runs in the company’s infra) over VPN
- Block marketplace
    - Public block marketplace: managed by Freelunch (HuggingFace Hub, but for Software Engineering)
    - Private Block Registry running in the company’s infra
- Hot reloading on codebase changes (bacause codebase can be changed directly)
- Request support button: were a developer can record his screen, describe the suport request, and click send. It will build a suport request with all the necessary context and avaiable time for debugging meeting that will be sent to *on-call* platform engineers in their preferred communicaiton tool
- Deploys can be configured to only be done if certain roles aprove it (e.g., Staff Engineer + Distinguished Engineer)
- User & AI audit logs (tracks every action made)
- Can install tool-specific add-ons (e.g. K8s, Airflow or Terraform add-ons) from the marketplace.: These will you add to the root of your codebase a user-friendly directory + tool-specific code scaffold inside it with your current development (this directory already exisits in the codebase, but it normally is burried in a deep directory and just used by lunch-idp internally). In there, you should modify tool-specific code, respecting the structure documented in the add-on. The add-on also will automatically lint that directory to make shure its correct. This enables power users to take advantage of tool-specific features by lowering down to the actual codebase when needed. It also enables users to integrate thei existing tool-specific code.
- When developer needs something to be reviewed by another engineer:
    - chat thread for that specific review is spawned (like PR chat thread on github)
    - If using `lunch-vibekill`: AI helps reviewer engineer by providing a review that can be approved, edited or removed
- If using `lunch-vibekill`:
    - get AI explanations of a certain GUI feature by right clicking it
    - get automatic code → docs (saying its ai generated, pending human approval) hook that gets triggered upon code commits
    - automatic code completion
    - automatic code improvement suggestions
    - plugin-specific ai-powerd buttons (e.g., log analysis)

---

## 🧑‍🚒 Installation of `lunch-back`

- self-hosted
    - Single-machine (on-premise or cloud)
    - Bare Metal cluster (on-premise or cloud)
    - VM cluster (on-premise or cloud)
    - K8s cluster (on-premise or cloud)
- **[paid]** managed by us (PaaS)

---

## 🚀 Go-To-Market Strategy (Short-term)

### *[3 Months, without funding]* Phase A: Building the Block Hub

**Ideal first users:** comapanies with ****software departments that have 20+ head count.

**Specific pain of these users that will be tackled**: Writing things from scratch/duplicate unaligned work across projects, or wasting time finding pre-built components and services information from company internal sources or public sources.

**Solve the pain with:**  `lunch-hub` (Block Marketplace) just focused on services and infra at first. It’s like *HuggingFace Hub*, but for Software Engineering, and with the UX feeling of *N8N*. Bonus: enables plug-in-play with *Kubevela* to compose and deploy these blocks.

Why not just use [Artifact Hub](https://artifacthub.io/)?

- too low-level/complicated for developers use, an mixes platform engineer needs with developer needs: we solve by with following an evolution of the [*Open Application Model*](https://oam.dev/) standard, focusing on the developer
- no format stadardization for code, infra and policy components. We solve by with following an evolution of the [*Open Application Model*](https://oam.dev/) standard.
- no nice GUI that shows components as blocks with properties and enables sandbox preview: we provide an intuitive tool-agnostic block-based GUI where users can easily see blocks of code, infra or policcies with arguments, metadatada, plugins, etc; and preview in a sandbox (think of [Kodecloud plagrounds](https://kodekloud.com/playgrounds/))
- no support for blocks of blocks (hierarchical composition): we solve by with following an evolution of the [*Open Application Model*](https://oam.dev/) standard
- no plug-and-play with *Kubevela.*
- no private registry (think of [HugginFace Enterprise Hub](https://huggingface.co/enterprise)) for a company to store it’s internal components that should not be exposed publicly.

**Magical Moment:** in a single-screen visualize, preview in sandbox and search standardized, modular, ready-for-use infra, services and pipelines, that can be downloaded with 1 click.

### *[3 Months, with funding]* Phase B: Providing Support for Block Development and Integration with Existing Codebases

**Ideal first users:** companies using `lunch-hub`

**Specific pain of these users that will be tackled**: After getting a block from the `lunch-hub`, integrating it inside an existing codebase is not trivial, coding agents are not used to dealing with lunch blocks. Also, building the blocks is not easy, no GUI, auto-contanarization, static analysis and tests support.

**Solve the pain with:** `lunch-block` just focused on block integration with existing codebases at first, using coding assitants (claude code / open code / cursor / github copilot /  etc).

**Magical moment**: user writes to his coding assistant something like “I need to serve DeepSeek asa service in my k8s cluster, I’d also like to setup my project with a popular gitops on k8s codebase” and he instantaneously sees the suggested resources in `lunch-hub`, for each of hsi needs, then he clicks “use these resources”, and the coding assistant implements what he wanted using those resources.

### *[6 months, with funding]* Phase C: Building the Minimal Viable IDP

- `lunch-cycle` MVP-version (Microservices Lifecycle)
- `lunch-platform` MVP-version (Platform Control)

These enable a **closed end-to-end loop**: design → code → run → observe → design or code → observe → deploy → observe

Once this loop works, the rest of the fronts become powerful extensions.

### *[6 months, with funding]* Phase D: Building the Minimal Remarkable IDP

- `lunch-metalang`  MVP-version (Microservices Build-time Framework)
- `lunch-observe` MVP-version (Observability)

These enable **developing and debugging distributed systems like local code.**

---

## 🌎 Company Strategy

Follow the strategy of sucessfull open core companies like *HuggingFace*.

- Community: Create Strong Community around an ecossytem of tools
- Hyper Growth: In the first years, focus more on getting users than revenue
- Funding: Raise Money telling investors it will payoff after the HyperGrowth period

---

## ❓FAQ

**1. Why would a developer use lunch-idp instead of a traditional GUI-based IDP like Backstage or Port?**

- **lunch-idp** would be a *platform*, not just a *portal*.
- The developer rarely asks for a platform directly — the decision usually comes from above (not by imposing it, but by evangelizing developers, running workshops, and testing it on lower-risk projects).
- Adoption would come from the features mentioned in the document, from seeing successful use cases from our design partners, from being open-core, and from trying a specific plugin they liked (e.g. *lunch-discovery*, the Discovery plugin).

**2. How does the product handle rich visualizations (performance charts, dashboards, dependency graphs) without leaving VSCode?**

- Through *webviews* inside the plugins.

**3. How does lunch-idp integrate with the existing corporate ecosystem, including GitHub, ArgoCD, and Grafana?**

- Projects are scaffolded with GitOps already configured.
- ArgoCD would be used under the hood for Kubernetes deployments.
- Grafana might also be used under the hood for monitoring.
- Teams can keep using Grafana for observability if they don’t want to adopt lunch-idp’s built-in observability yet.
- If a team wants to migrate an existing project already set up with CI/CD, they would need to adapt it to the lunch-idp structure, assisted by *lunch-migrate* — an AI coding agent designed to ease migration.

**4. What’s the “magic moment” that demonstrates immediate value to the developer?**

- When they realize they can do everything end-to-end just by composing “lego blocks,” adding decorators to code, using SDKs, and using the GUI — allowing them to focus purely on business logic.

**5. How does the product scale across large, heterogeneous teams (multiple languages, clouds, and stacks)?**

- It’s library-agnostic at the application level (container-based with auto-containerization).
- Planned support for several languages (thinking Java, Go, Rust, Python).
- Supports major clouds — developers can switch clouds with a click, and even create/use multi-cloud infra blocks.

**6. What data flows between the developer’s VSCode and the company backend, and how is it secured?**

- Traffic goes over a VPN.
- Data transmitted: basically everything, since the plugins are frontends consuming from the backend.

**7. How dependent is the project on VSCode, and what’s the portability plan?**

- **Short term:** VSCode only.
- **Mid term:** Support for multiple IDEs.
- **Long term:** Our own IDE.

**8. How do you plan to build and grow a developer community around the project?**

- Through online communities, attending events, posting on YouTube and social media, and showcasing success stories from design partners.

**9. What license will you adopt for the open-source core, and how does it connect to monetization?**

- A **source-available license**: companies can use and modify internally as much as they want, but cannot redistribute derivative software.
- This prevents competing open-source plugins from emerging against our paid ones.

**10. Do you believe VSCode is a sustainable base medium/long term?**

- **Medium term:** yes.
- **Long term:** no — I plan to eventually build our own IDE.

**11. Are there plans for a chat or conversational (AI) interface?**

- Yes — it would be **lunch-vibekill**, the project management and AI-assisted engineering plugin with an AI assistant specialized in the lunch-idp ecosystem.

**12. Are security and compliance issues already mapped or under development?**

- Not mapped in detail yet — but there would be a dedicated plugin for that, **lunch-sec**.

**13. How will managers, auditors, and leadership have visibility without VSCode access?**

- A **comment-only web interface** providing an overview of everything they need to know — **lunch-leader**.

**14. What’s the current technical maturity level?**

- It’s still **conceptual**. I’m looking for a cofounder and want to develop it alongside design partners.