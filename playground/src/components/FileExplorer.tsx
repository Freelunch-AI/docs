import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

const fileTree: FileNode[] = [
  {
    name: '.github',
    type: 'folder',
    path: '.github',
    children: [
      {
        name: 'workflows',
        type: 'folder',
        path: '.github/workflows',
        children: [
          { name: 'ci.yml', type: 'file', path: '.github/workflows/ci.yml' },
          { name: 'cd.yml', type: 'file', path: '.github/workflows/cd.yml' },
          { name: 'security-scan.yml', type: 'file', path: '.github/workflows/security-scan.yml' },
          { name: 'buildpacks-build.yml', type: 'file', path: '.github/workflows/buildpacks-build.yml' },
        ],
      },
      { name: 'CODEOWNERS', type: 'file', path: '.github/CODEOWNERS' },
      { name: 'CONTRIBUTING.md', type: 'file', path: '.github/CONTRIBUTING.md' },
    ],
  },
  {
    name: 'docs',
    type: 'folder',
    path: 'docs',
    children: [
      { name: 'README.md', type: 'file', path: 'docs/README.md' },
      { name: 'ARCHITECTURE.md', type: 'file', path: 'docs/ARCHITECTURE.md' },
      { name: 'DEPLOYMENT.md', type: 'file', path: 'docs/DEPLOYMENT.md' },
      { name: 'DEVELOPMENT.md', type: 'file', path: 'docs/DEVELOPMENT.md' },
      {
        name: 'architecture',
        type: 'folder',
        path: 'docs/architecture',
        children: [
          { name: 'adr-001-use-dapr.md', type: 'file', path: 'docs/architecture/adr-001-use-dapr.md' },
          { name: 'adr-002-kubevela-deployment.md', type: 'file', path: 'docs/architecture/adr-002-kubevela-deployment.md' },
          { name: 'adr-003-zenml-pipelines.md', type: 'file', path: 'docs/architecture/adr-003-zenml-pipelines.md' },
          { name: 'service-mesh-design.md', type: 'file', path: 'docs/architecture/service-mesh-design.md' },
        ],
      },
      {
        name: 'runbooks',
        type: 'folder',
        path: 'docs/runbooks',
        children: [
          { name: 'incident-response.md', type: 'file', path: 'docs/runbooks/incident-response.md' },
          { name: 'scaling-guide.md', type: 'file', path: 'docs/runbooks/scaling-guide.md' },
          { name: 'database-migrations.md', type: 'file', path: 'docs/runbooks/database-migrations.md' },
        ],
      },
    ],
  },
  {
    name: 'services',
    type: 'folder',
    path: 'services',
    children: [
      {
        name: 'api-gateway',
        type: 'folder',
        path: 'services/api-gateway',
        children: [
          { name: 'main.go', type: 'file', path: 'services/api-gateway/main.go' },
          { name: 'go.mod', type: 'file', path: 'services/api-gateway/go.mod' },
          { name: 'Dockerfile', type: 'file', path: 'services/api-gateway/Dockerfile' },
          { name: 'project.toml', type: 'file', path: 'services/api-gateway/project.toml' },
          { name: 'README.md', type: 'file', path: 'services/api-gateway/README.md' },
          {
            name: 'components',
            type: 'folder',
            path: 'services/api-gateway/components',
            children: [
              { name: 'pubsub.yaml', type: 'file', path: 'services/api-gateway/components/pubsub.yaml' },
              { name: 'statestore.yaml', type: 'file', path: 'services/api-gateway/components/statestore.yaml' },
            ],
          },
        ],
      },
      {
        name: 'product-catalog',
        type: 'folder',
        path: 'services/product-catalog',
        children: [
          { name: 'main.py', type: 'file', path: 'services/product-catalog/main.py' },
          { name: 'requirements.txt', type: 'file', path: 'services/product-catalog/requirements.txt' },
          { name: 'Dockerfile', type: 'file', path: 'services/product-catalog/Dockerfile' },
          { name: 'project.toml', type: 'file', path: 'services/product-catalog/project.toml' },
          { name: 'README.md', type: 'file', path: 'services/product-catalog/README.md' },
          {
            name: 'alembic',
            type: 'folder',
            path: 'services/product-catalog/alembic',
            children: [
              { name: 'env.py', type: 'file', path: 'services/product-catalog/alembic/env.py' },
              { name: 'alembic.ini', type: 'file', path: 'services/product-catalog/alembic/alembic.ini' },
              {
                name: 'versions',
                type: 'folder',
                path: 'services/product-catalog/alembic/versions',
                children: [
                  { name: '001_initial_schema.py', type: 'file', path: 'services/product-catalog/alembic/versions/001_initial_schema.py' },
                  { name: '002_add_indexes.py', type: 'file', path: 'services/product-catalog/alembic/versions/002_add_indexes.py' },
                ],
              },
            ],
          },
          {
            name: 'components',
            type: 'folder',
            path: 'services/product-catalog/components',
            children: [
              { name: 'pubsub.yaml', type: 'file', path: 'services/product-catalog/components/pubsub.yaml' },
              { name: 'statestore.yaml', type: 'file', path: 'services/product-catalog/components/statestore.yaml' },
            ],
          },
        ],
      },
      {
        name: 'order-service',
        type: 'folder',
        path: 'services/order-service',
        children: [
          { name: 'index.ts', type: 'file', path: 'services/order-service/index.ts' },
          { name: 'package.json', type: 'file', path: 'services/order-service/package.json' },
          { name: 'tsconfig.json', type: 'file', path: 'services/order-service/tsconfig.json' },
          { name: 'Dockerfile', type: 'file', path: 'services/order-service/Dockerfile' },
          { name: 'project.toml', type: 'file', path: 'services/order-service/project.toml' },
          { name: 'README.md', type: 'file', path: 'services/order-service/README.md' },
          {
            name: 'components',
            type: 'folder',
            path: 'services/order-service/components',
            children: [
              { name: 'pubsub.yaml', type: 'file', path: 'services/order-service/components/pubsub.yaml' },
              { name: 'statestore.yaml', type: 'file', path: 'services/order-service/components/statestore.yaml' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'frontend',
    type: 'folder',
    path: 'frontend',
    children: [
      {
        name: 'web-app',
        type: 'folder',
        path: 'frontend/web-app',
        children: [
          { name: 'package.json', type: 'file', path: 'frontend/web-app/package.json' },
          { name: 'vite.config.ts', type: 'file', path: 'frontend/web-app/vite.config.ts' },
          { name: 'tsconfig.json', type: 'file', path: 'frontend/web-app/tsconfig.json' },
          { name: 'index.html', type: 'file', path: 'frontend/web-app/index.html' },
          { name: 'Dockerfile', type: 'file', path: 'frontend/web-app/Dockerfile' },
          { name: 'project.toml', type: 'file', path: 'frontend/web-app/project.toml' },
          { name: 'README.md', type: 'file', path: 'frontend/web-app/README.md' },
          {
            name: 'src',
            type: 'folder',
            path: 'frontend/web-app/src',
            children: [
              { name: 'App.tsx', type: 'file', path: 'frontend/web-app/src/App.tsx' },
              { name: 'main.tsx', type: 'file', path: 'frontend/web-app/src/main.tsx' },
              { name: 'keycloak-config.ts', type: 'file', path: 'frontend/web-app/src/keycloak-config.ts' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'pipelines',
    type: 'folder',
    path: 'pipelines',
    children: [
      {
        name: 'zenml',
        type: 'folder',
        path: 'pipelines/zenml',
        children: [
          { name: 'README.md', type: 'file', path: 'pipelines/zenml/README.md' },
          {
            name: 'training',
            type: 'folder',
            path: 'pipelines/zenml/training',
            children: [
              { name: 'ml_pipeline.py', type: 'file', path: 'pipelines/zenml/training/ml_pipeline.py' },
              { name: 'config.yaml', type: 'file', path: 'pipelines/zenml/training/config.yaml' },
            ],
          },
          {
            name: 'etl',
            type: 'folder',
            path: 'pipelines/zenml/etl',
            children: [
              { name: 'data_pipeline.py', type: 'file', path: 'pipelines/zenml/etl/data_pipeline.py' },
              { name: 'config.yaml', type: 'file', path: 'pipelines/zenml/etl/config.yaml' },
            ],
          },
          { name: 'zenml_config.yaml', type: 'file', path: 'pipelines/zenml/zenml_config.yaml' },
        ],
      },
    ],
  },
  {
    name: 'platform',
    type: 'folder',
    path: 'platform',
    children: [
      {
        name: 'local-dev',
        type: 'folder',
        path: 'platform/local-dev',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/local-dev/README.md' },
          { name: 'docker-compose.yml', type: 'file', path: 'platform/local-dev/docker-compose.yml' },
          { name: 'Makefile', type: 'file', path: 'platform/local-dev/Makefile' },
          {
            name: 'kind',
            type: 'folder',
            path: 'platform/local-dev/kind',
            children: [
              { name: 'README.md', type: 'file', path: 'platform/local-dev/kind/README.md' },
              { name: 'kind-config.yaml', type: 'file', path: 'platform/local-dev/kind/kind-config.yaml' },
              { name: 'setup.sh', type: 'file', path: 'platform/local-dev/kind/setup.sh' },
              { name: 'install-addons.sh', type: 'file', path: 'platform/local-dev/kind/install-addons.sh' },
              {
                name: 'manifests',
                type: 'folder',
                path: 'platform/local-dev/kind/manifests',
                children: [
                  { name: 'metallb-config.yaml', type: 'file', path: 'platform/local-dev/kind/manifests/metallb-config.yaml' },
                  { name: 'ingress-nginx.yaml', type: 'file', path: 'platform/local-dev/kind/manifests/ingress-nginx.yaml' },
                  { name: 'local-storage.yaml', type: 'file', path: 'platform/local-dev/kind/manifests/local-storage.yaml' },
                ],
              },
            ],
          },
          {
            name: 'localstack',
            type: 'folder',
            path: 'platform/local-dev/localstack',
            children: [
              { name: 'README.md', type: 'file', path: 'platform/local-dev/localstack/README.md' },
              { name: 'docker-compose.localstack.yml', type: 'file', path: 'platform/local-dev/localstack/docker-compose.localstack.yml' },
              { name: 'init-aws.sh', type: 'file', path: 'platform/local-dev/localstack/init-aws.sh' },
              {
                name: 'config',
                type: 'folder',
                path: 'platform/local-dev/localstack/config',
                children: [
                  { name: 's3-buckets.json', type: 'file', path: 'platform/local-dev/localstack/config/s3-buckets.json' },
                  { name: 'sqs-queues.json', type: 'file', path: 'platform/local-dev/localstack/config/sqs-queues.json' },
                  { name: 'dynamodb-tables.json', type: 'file', path: 'platform/local-dev/localstack/config/dynamodb-tables.json' },
                ],
              },
              {
                name: 'scripts',
                type: 'folder',
                path: 'platform/local-dev/localstack/scripts',
                children: [
                  { name: 'seed-data.sh', type: 'file', path: 'platform/local-dev/localstack/scripts/seed-data.sh' },
                  { name: 'test-services.sh', type: 'file', path: 'platform/local-dev/localstack/scripts/test-services.sh' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'dapr',
        type: 'folder',
        path: 'platform/dapr',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/dapr/README.md' },
          {
            name: 'components',
            type: 'folder',
            path: 'platform/dapr/components',
            children: [
              { name: 'pubsub-redis.yaml', type: 'file', path: 'platform/dapr/components/pubsub-redis.yaml' },
              { name: 'statestore-redis.yaml', type: 'file', path: 'platform/dapr/components/statestore-redis.yaml' },
              { name: 'bindings-kafka.yaml', type: 'file', path: 'platform/dapr/components/bindings-kafka.yaml' },
              { name: 'secretstore-kubernetes.yaml', type: 'file', path: 'platform/dapr/components/secretstore-kubernetes.yaml' },
            ],
          },
          {
            name: 'configuration',
            type: 'folder',
            path: 'platform/dapr/configuration',
            children: [
              { name: 'tracing.yaml', type: 'file', path: 'platform/dapr/configuration/tracing.yaml' },
              { name: 'metrics.yaml', type: 'file', path: 'platform/dapr/configuration/metrics.yaml' },
              { name: 'middleware.yaml', type: 'file', path: 'platform/dapr/configuration/middleware.yaml' },
            ],
          },
        ],
      },
      {
        name: 'kubevela',
        type: 'folder',
        path: 'platform/kubevela',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/kubevela/README.md' },
          { name: 'vela-system-install.yaml', type: 'file', path: 'platform/kubevela/vela-system-install.yaml' },
          {
            name: 'applications',
            type: 'folder',
            path: 'platform/kubevela/applications',
            children: [
              { name: 'api-gateway-app.yaml', type: 'file', path: 'platform/kubevela/applications/api-gateway-app.yaml' },
              { name: 'product-catalog-app.yaml', type: 'file', path: 'platform/kubevela/applications/product-catalog-app.yaml' },
              { name: 'order-service-app.yaml', type: 'file', path: 'platform/kubevela/applications/order-service-app.yaml' },
            ],
          },
          {
            name: 'definitions',
            type: 'folder',
            path: 'platform/kubevela/definitions',
            children: [
              { name: 'component-definitions.yaml', type: 'file', path: 'platform/kubevela/definitions/component-definitions.yaml' },
              { name: 'trait-definitions.yaml', type: 'file', path: 'platform/kubevela/definitions/trait-definitions.yaml' },
              { name: 'workflow-definitions.yaml', type: 'file', path: 'platform/kubevela/definitions/workflow-definitions.yaml' },
            ],
          },
          {
            name: 'policies',
            type: 'folder',
            path: 'platform/kubevela/policies',
            children: [
              { name: 'health-check-policy.yaml', type: 'file', path: 'platform/kubevela/policies/health-check-policy.yaml' },
              { name: 'garbage-collection-policy.yaml', type: 'file', path: 'platform/kubevela/policies/garbage-collection-policy.yaml' },
            ],
          },
        ],
      },
      {
        name: 'meshery',
        type: 'folder',
        path: 'platform/meshery',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/meshery/README.md' },
          { name: 'meshery-config.yaml', type: 'file', path: 'platform/meshery/meshery-config.yaml' },
          {
            name: 'patterns',
            type: 'folder',
            path: 'platform/meshery/patterns',
            children: [
              { name: 'service-mesh-pattern.yaml', type: 'file', path: 'platform/meshery/patterns/service-mesh-pattern.yaml' },
              { name: 'observability-pattern.yaml', type: 'file', path: 'platform/meshery/patterns/observability-pattern.yaml' },
            ],
          },
          {
            name: 'filters',
            type: 'folder',
            path: 'platform/meshery/filters',
            children: [
              { name: 'traffic-management.yaml', type: 'file', path: 'platform/meshery/filters/traffic-management.yaml' },
              { name: 'security-policies.yaml', type: 'file', path: 'platform/meshery/filters/security-policies.yaml' },
            ],
          },
        ],
      },
      {
        name: 'observability',
        type: 'folder',
        path: 'platform/observability',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/observability/README.md' },
          {
            name: 'opentelemetry',
            type: 'folder',
            path: 'platform/observability/opentelemetry',
            children: [
              { name: 'collector-config.yaml', type: 'file', path: 'platform/observability/opentelemetry/collector-config.yaml' },
              { name: 'deployment.yaml', type: 'file', path: 'platform/observability/opentelemetry/deployment.yaml' },
              { name: 'instrumentation.yaml', type: 'file', path: 'platform/observability/opentelemetry/instrumentation.yaml' },
            ],
          },
          {
            name: 'openlineage',
            type: 'folder',
            path: 'platform/observability/openlineage',
            children: [
              { name: 'config.yaml', type: 'file', path: 'platform/observability/openlineage/config.yaml' },
              { name: 'marquez-deployment.yaml', type: 'file', path: 'platform/observability/openlineage/marquez-deployment.yaml' },
            ],
          },
          {
            name: 'monitoring',
            type: 'folder',
            path: 'platform/observability/monitoring',
            children: [
              { name: 'prometheus.yaml', type: 'file', path: 'platform/observability/monitoring/prometheus.yaml' },
              { name: 'grafana-dashboards.json', type: 'file', path: 'platform/observability/monitoring/grafana-dashboards.json' },
              { name: 'alertmanager.yaml', type: 'file', path: 'platform/observability/monitoring/alertmanager.yaml' },
            ],
          },
        ],
      },
      {
        name: 'backstage',
        type: 'folder',
        path: 'platform/backstage',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/backstage/README.md' },
          { name: 'app-config.yaml', type: 'file', path: 'platform/backstage/app-config.yaml' },
          { name: 'app-config.production.yaml', type: 'file', path: 'platform/backstage/app-config.production.yaml' },
          {
            name: 'catalog',
            type: 'folder',
            path: 'platform/backstage/catalog',
            children: [
              { name: 'catalog-info.yaml', type: 'file', path: 'platform/backstage/catalog/catalog-info.yaml' },
              { name: 'systems.yaml', type: 'file', path: 'platform/backstage/catalog/systems.yaml' },
              { name: 'components.yaml', type: 'file', path: 'platform/backstage/catalog/components.yaml' },
              { name: 'resources.yaml', type: 'file', path: 'platform/backstage/catalog/resources.yaml' },
            ],
          },
          {
            name: 'templates',
            type: 'folder',
            path: 'platform/backstage/templates',
            children: [
              { name: 'microservice-template.yaml', type: 'file', path: 'platform/backstage/templates/microservice-template.yaml' },
              { name: 'ml-pipeline-template.yaml', type: 'file', path: 'platform/backstage/templates/ml-pipeline-template.yaml' },
            ],
          },
        ],
      },
      {
        name: 'buildpacks',
        type: 'folder',
        path: 'platform/buildpacks',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/buildpacks/README.md' },
          { name: 'builder.toml', type: 'file', path: 'platform/buildpacks/builder.toml' },
          { name: 'build.sh', type: 'file', path: 'platform/buildpacks/build.sh' },
          {
            name: 'buildpacks',
            type: 'folder',
            path: 'platform/buildpacks/buildpacks',
            children: [
              { name: 'python-buildpack.toml', type: 'file', path: 'platform/buildpacks/buildpacks/python-buildpack.toml' },
              { name: 'nodejs-buildpack.toml', type: 'file', path: 'platform/buildpacks/buildpacks/nodejs-buildpack.toml' },
              { name: 'go-buildpack.toml', type: 'file', path: 'platform/buildpacks/buildpacks/go-buildpack.toml' },
            ],
          },
        ],
      },
      {
        name: 'keycloak',
        type: 'folder',
        path: 'platform/keycloak',
        children: [
          { name: 'README.md', type: 'file', path: 'platform/keycloak/README.md' },
          { name: 'deployment.yaml', type: 'file', path: 'platform/keycloak/deployment.yaml' },
          {
            name: 'realms',
            type: 'folder',
            path: 'platform/keycloak/realms',
            children: [
              { name: 'micromart-realm.json', type: 'file', path: 'platform/keycloak/realms/micromart-realm.json' },
              { name: 'clients.json', type: 'file', path: 'platform/keycloak/realms/clients.json' },
              { name: 'roles.json', type: 'file', path: 'platform/keycloak/realms/roles.json' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'infrastructure',
    type: 'folder',
    path: 'infrastructure',
    children: [
      {
        name: 'crossplane',
        type: 'folder',
        path: 'infrastructure/crossplane',
        children: [
          { name: 'README.md', type: 'file', path: 'infrastructure/crossplane/README.md' },
          { name: 'provider-aws.yaml', type: 'file', path: 'infrastructure/crossplane/provider-aws.yaml' },
          { name: 'provider-gcp.yaml', type: 'file', path: 'infrastructure/crossplane/provider-gcp.yaml' },
          { name: 'provider-azure.yaml', type: 'file', path: 'infrastructure/crossplane/provider-azure.yaml' },
          {
            name: 'compositions',
            type: 'folder',
            path: 'infrastructure/crossplane/compositions',
            children: [
              { name: 'xrd-database.yaml', type: 'file', path: 'infrastructure/crossplane/compositions/xrd-database.yaml' },
              { name: 'xrd-redis.yaml', type: 'file', path: 'infrastructure/crossplane/compositions/xrd-redis.yaml' },
              { name: 'xrd-storage.yaml', type: 'file', path: 'infrastructure/crossplane/compositions/xrd-storage.yaml' },
              { name: 'composition-postgres.yaml', type: 'file', path: 'infrastructure/crossplane/compositions/composition-postgres.yaml' },
              { name: 'composition-redis.yaml', type: 'file', path: 'infrastructure/crossplane/compositions/composition-redis.yaml' },
            ],
          },
          {
            name: 'claims',
            type: 'folder',
            path: 'infrastructure/crossplane/claims',
            children: [
              { name: 'product-database.yaml', type: 'file', path: 'infrastructure/crossplane/claims/product-database.yaml' },
              { name: 'cache-cluster.yaml', type: 'file', path: 'infrastructure/crossplane/claims/cache-cluster.yaml' },
              { name: 'object-storage.yaml', type: 'file', path: 'infrastructure/crossplane/claims/object-storage.yaml' },
            ],
          },
        ],
      },
      {
        name: 'ansible',
        type: 'folder',
        path: 'infrastructure/ansible',
        children: [
          { name: 'README.md', type: 'file', path: 'infrastructure/ansible/README.md' },
          { name: 'ansible.cfg', type: 'file', path: 'infrastructure/ansible/ansible.cfg' },
          { name: 'inventory.yml', type: 'file', path: 'infrastructure/ansible/inventory.yml' },
          {
            name: 'playbooks',
            type: 'folder',
            path: 'infrastructure/ansible/playbooks',
            children: [
              { name: 'bootstrap-cluster.yml', type: 'file', path: 'infrastructure/ansible/playbooks/bootstrap-cluster.yml' },
              { name: 'install-k8s.yml', type: 'file', path: 'infrastructure/ansible/playbooks/install-k8s.yml' },
              { name: 'configure-networking.yml', type: 'file', path: 'infrastructure/ansible/playbooks/configure-networking.yml' },
              { name: 'install-kubeedge.yml', type: 'file', path: 'infrastructure/ansible/playbooks/install-kubeedge.yml' },
            ],
          },
          {
            name: 'roles',
            type: 'folder',
            path: 'infrastructure/ansible/roles',
            children: [
              {
                name: 'kubernetes',
                type: 'folder',
                path: 'infrastructure/ansible/roles/kubernetes',
                children: [
                  { name: 'tasks.yml', type: 'file', path: 'infrastructure/ansible/roles/kubernetes/tasks.yml' },
                  { name: 'defaults.yml', type: 'file', path: 'infrastructure/ansible/roles/kubernetes/defaults.yml' },
                ],
              },
              {
                name: 'rancher',
                type: 'folder',
                path: 'infrastructure/ansible/roles/rancher',
                children: [
                  { name: 'tasks.yml', type: 'file', path: 'infrastructure/ansible/roles/rancher/tasks.yml' },
                  { name: 'defaults.yml', type: 'file', path: 'infrastructure/ansible/roles/rancher/defaults.yml' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'rancher',
        type: 'folder',
        path: 'infrastructure/rancher',
        children: [
          { name: 'README.md', type: 'file', path: 'infrastructure/rancher/README.md' },
          { name: 'rancher-deployment.yaml', type: 'file', path: 'infrastructure/rancher/rancher-deployment.yaml' },
          {
            name: 'clusters',
            type: 'folder',
            path: 'infrastructure/rancher/clusters',
            children: [
              { name: 'production-cluster.yaml', type: 'file', path: 'infrastructure/rancher/clusters/production-cluster.yaml' },
              { name: 'staging-cluster.yaml', type: 'file', path: 'infrastructure/rancher/clusters/staging-cluster.yaml' },
              { name: 'edge-cluster.yaml', type: 'file', path: 'infrastructure/rancher/clusters/edge-cluster.yaml' },
            ],
          },
        ],
      },
      {
        name: 'kubeedge',
        type: 'folder',
        path: 'infrastructure/kubeedge',
        children: [
          { name: 'README.md', type: 'file', path: 'infrastructure/kubeedge/README.md' },
          { name: 'cloudcore-config.yaml', type: 'file', path: 'infrastructure/kubeedge/cloudcore-config.yaml' },
          { name: 'edgecore-config.yaml', type: 'file', path: 'infrastructure/kubeedge/edgecore-config.yaml' },
          {
            name: 'devices',
            type: 'folder',
            path: 'infrastructure/kubeedge/devices',
            children: [
              { name: 'device-model.yaml', type: 'file', path: 'infrastructure/kubeedge/devices/device-model.yaml' },
              { name: 'device-instance.yaml', type: 'file', path: 'infrastructure/kubeedge/devices/device-instance.yaml' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'kubernetes',
    type: 'folder',
    path: 'kubernetes',
    children: [
      { name: 'README.md', type: 'file', path: 'kubernetes/README.md' },
      {
        name: 'base',
        type: 'folder',
        path: 'kubernetes/base',
        children: [
          { name: 'kustomization.yaml', type: 'file', path: 'kubernetes/base/kustomization.yaml' },
          { name: 'namespace.yaml', type: 'file', path: 'kubernetes/base/namespace.yaml' },
        ],
      },
      {
        name: 'overlays',
        type: 'folder',
        path: 'kubernetes/overlays',
        children: [
          {
            name: 'production',
            type: 'folder',
            path: 'kubernetes/overlays/production',
            children: [
              { name: 'kustomization.yaml', type: 'file', path: 'kubernetes/overlays/production/kustomization.yaml' },
              { name: 'replica-patch.yaml', type: 'file', path: 'kubernetes/overlays/production/replica-patch.yaml' },
            ],
          },
          {
            name: 'staging',
            type: 'folder',
            path: 'kubernetes/overlays/staging',
            children: [
              { name: 'kustomization.yaml', type: 'file', path: 'kubernetes/overlays/staging/kustomization.yaml' },
            ],
          },
        ],
      },
      {
        name: 'policies',
        type: 'folder',
        path: 'kubernetes/policies',
        children: [
          { name: 'README.md', type: 'file', path: 'kubernetes/policies/README.md' },
          {
            name: 'kyverno',
            type: 'folder',
            path: 'kubernetes/policies/kyverno',
            children: [
              { name: 'install.yaml', type: 'file', path: 'kubernetes/policies/kyverno/install.yaml' },
              {
                name: 'policies',
                type: 'folder',
                path: 'kubernetes/policies/kyverno/policies',
                children: [
                  { name: 'require-labels.yaml', type: 'file', path: 'kubernetes/policies/kyverno/policies/require-labels.yaml' },
                  { name: 'disallow-privileged.yaml', type: 'file', path: 'kubernetes/policies/kyverno/policies/disallow-privileged.yaml' },
                  { name: 'require-resource-limits.yaml', type: 'file', path: 'kubernetes/policies/kyverno/policies/require-resource-limits.yaml' },
                  { name: 'generate-network-policy.yaml', type: 'file', path: 'kubernetes/policies/kyverno/policies/generate-network-policy.yaml' },
                ],
              },
              {
                name: 'cluster-policies',
                type: 'folder',
                path: 'kubernetes/policies/kyverno/cluster-policies',
                children: [
                  { name: 'pod-security-standards.yaml', type: 'file', path: 'kubernetes/policies/kyverno/cluster-policies/pod-security-standards.yaml' },
                  { name: 'image-verification.yaml', type: 'file', path: 'kubernetes/policies/kyverno/cluster-policies/image-verification.yaml' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'data',
    type: 'folder',
    path: 'data',
    children: [
      {
        name: 'bytebase',
        type: 'folder',
        path: 'data/bytebase',
        children: [
          { name: 'README.md', type: 'file', path: 'data/bytebase/README.md' },
          { name: 'deployment.yaml', type: 'file', path: 'data/bytebase/deployment.yaml' },
          {
            name: 'migrations',
            type: 'folder',
            path: 'data/bytebase/migrations',
            children: [
              { name: 'products-db-schema.sql', type: 'file', path: 'data/bytebase/migrations/products-db-schema.sql' },
              { name: 'orders-db-schema.sql', type: 'file', path: 'data/bytebase/migrations/orders-db-schema.sql' },
            ],
          },
          {
            name: 'policies',
            type: 'folder',
            path: 'data/bytebase/policies',
            children: [
              { name: 'approval-policy.yaml', type: 'file', path: 'data/bytebase/policies/approval-policy.yaml' },
              { name: 'backup-policy.yaml', type: 'file', path: 'data/bytebase/policies/backup-policy.yaml' },
            ],
          },
        ],
      },
      {
        name: 'lakefs',
        type: 'folder',
        path: 'data/lakefs',
        children: [
          { name: 'README.md', type: 'file', path: 'data/lakefs/README.md' },
          { name: 'lakefs-config.yaml', type: 'file', path: 'data/lakefs/lakefs-config.yaml' },
          { name: 'deployment.yaml', type: 'file', path: 'data/lakefs/deployment.yaml' },
          {
            name: 'repositories',
            type: 'folder',
            path: 'data/lakefs/repositories',
            children: [
              { name: 'ml-datasets-repo.yaml', type: 'file', path: 'data/lakefs/repositories/ml-datasets-repo.yaml' },
              { name: 'analytics-data-repo.yaml', type: 'file', path: 'data/lakefs/repositories/analytics-data-repo.yaml' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'scripts',
    type: 'folder',
    path: 'scripts',
    children: [
      { name: 'README.md', type: 'file', path: 'scripts/README.md' },
      { name: 'setup-environment.sh', type: 'file', path: 'scripts/setup-environment.sh' },
      { name: 'deploy.sh', type: 'file', path: 'scripts/deploy.sh' },
      { name: 'rollback.sh', type: 'file', path: 'scripts/rollback.sh' },
      { name: 'health-check.sh', type: 'file', path: 'scripts/health-check.sh' },
      {
        name: 'ci',
        type: 'folder',
        path: 'scripts/ci',
        children: [
          { name: 'build-all-services.sh', type: 'file', path: 'scripts/ci/build-all-services.sh' },
          { name: 'run-tests.sh', type: 'file', path: 'scripts/ci/run-tests.sh' },
          { name: 'security-scan.sh', type: 'file', path: 'scripts/ci/security-scan.sh' },
        ],
      },
    ],
  },
  { name: 'docker-compose.yml', type: 'file', path: 'docker-compose.yml' },
  { name: 'skaffold.yaml', type: 'file', path: 'skaffold.yaml' },
  { name: 'Makefile', type: 'file', path: 'Makefile' },
  { name: 'README.md', type: 'file', path: 'README.md' },
  { name: 'CHANGELOG.md', type: 'file', path: 'CHANGELOG.md' },
  { name: 'LICENSE', type: 'file', path: 'LICENSE' },
  { name: '.gitignore', type: 'file', path: '.gitignore' },
  { name: '.gitattributes', type: 'file', path: '.gitattributes' },
];

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onFileClick: (path: string) => void;
}

function FileTreeItem({ node, level, onFileClick }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node.path);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-1 px-2 py-[2px] hover:bg-[#2a2d2e] cursor-pointer text-[13px] select-none"
        style={{ paddingLeft: `${level * 8 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <span className="text-[#cccccc] flex-shrink-0">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === 'folder' ? (
          isOpen ? (
            <FolderOpen size={16} className="text-[#cccccc] flex-shrink-0" />
          ) : (
            <Folder size={16} className="text-[#cccccc] flex-shrink-0" />
          )
        ) : (
          <File size={16} className="text-[#cccccc] flex-shrink-0" />
        )}
        <span className="text-[#cccccc]">{node.name}</span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileExplorerProps {
  onFileClick: (path: string) => void;
}

export function FileExplorer({ onFileClick }: FileExplorerProps) {
  return (
    <div className="w-full h-full bg-[#252526] overflow-y-auto border-r border-[#1e1e1e]">
      <div className="px-3 py-2 text-[11px] font-semibold text-[#cccccc] uppercase tracking-wide">
        Explorer
      </div>
      <div className="pb-2">
        <div className="px-2 py-1 text-[11px] font-semibold text-[#cccccc] flex items-center gap-1 uppercase tracking-wide">
          <ChevronDown size={16} />
          <span>LUNCH-IDP</span>
        </div>
        {fileTree.map((node) => (
          <FileTreeItem key={node.path} node={node} level={0} onFileClick={onFileClick} />
        ))}
      </div>
    </div>
  );
}
