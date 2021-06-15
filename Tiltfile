# -*- mode: Python -*
load('ext://local_output', 'local_output')
load('ext://restart_process', 'docker_build_with_restart')

config.define_string_list("to-run", args=True)

allow_k8s_contexts('minikube-pollify')

docker_envs = local_output('minikube docker-env -p minikube-pollify --shell \'none\'')
for line in docker_envs.splitlines():
    key_value = line.split('=')
    os.putenv(key_value[0], key_value[1])

host = local_output('./scripts/ip.sh -h')

def get_helm_args():
    args = []
    command_output = local_output('kip helmargs')[1:-1].strip().split('--set')
    for arg in command_output:
        args.append(arg.strip())
    return args

k8s_yaml(helm('services/gateway-service/deployments/deployment',
    name='gateway-service',
    namespace='core',
    values=['./environments/values-dev.yaml'],
    set=['global.serverHost='+host] + get_helm_args()
))

k8s_yaml(helm('services/discord-service/deployments/deployment',
    name='discord-service',
    namespace='core',
    values=['./environments/values-dev.yaml'],
    set=['global.serverHost='+host] + get_helm_args()
))

k8s_yaml(helm('services/poll-service/deployments/deployment',
    name='poll-service',
    namespace='core',
    values=['./environments/values-dev.yaml'],
    set=['global.serverHost='+host] + get_helm_args()
))

k8s_yaml(helm('services/vote-service/deployments/deployment',
    name='vote-service',
    namespace='core',
    values=['./environments/values-dev.yaml'],
    set=['global.serverHost='+host] + get_helm_args()
))

k8s_yaml(helm('services/image-service/deployments/deployment',
    name='image-service',
    namespace='core',
    values=['./environments/values-dev.yaml'],
    set=['global.serverHost='+host] + get_helm_args()
))

# local_resource('compile-protos', cmd='npm run build --prefix ./protos/', deps=['./protos/src/', './protos/dependencies/'])

cfg = config.parse()
to_run = cfg.get('to-run', [])

if 'gateway-service' in to_run:
    docker_build(
        'eu.gcr.io/pollify-315014/gateway-service',
        '.',
        target='dev',
        dockerfile='./services/gateway-service/Dockerfile',
        live_update=[
            sync('./services/gateway-service/src', '/usr/src/app/src')
        ],
        only=[
            './services/gateway-service',
            './packages'
        ]
    )

if 'discord-service' in to_run:
    docker_build(
        'eu.gcr.io/pollify-315014/discord-service',
        '.',
        target='dev',
        dockerfile='./services/discord-service/Dockerfile',
        live_update=[
            sync('./services/discord-service/src', '/usr/src/app/src')
        ],
        only=[
            './services/discord-service',
            './packages'
        ]
    )

if 'poll-service' in to_run:
    docker_build(
        'eu.gcr.io/pollify-315014/poll-service',
        '.',
        target='dev',
        dockerfile='./services/poll-service/Dockerfile',
        live_update=[
            sync('./services/poll-service/src', '/usr/src/app/src')
        ],
        only=[
            './services/poll-service',
            './packages'
        ]
    )

if 'vote-service' in to_run:
    docker_build(
        'eu.gcr.io/pollify-315014/vote-service',
        '.',
        target='dev',
        dockerfile='./services/vote-service/Dockerfile',
        live_update=[
            sync('./services/vote-service/src', '/usr/src/app/src')
        ],
        only=[
            './services/vote-service',
            './packages'
        ]
    )

if 'image-service' in to_run:
    docker_build(
        'eu.gcr.io/pollify-315014/image-service',
        '.',
        target='dev',
        dockerfile='./services/image-service/Dockerfile',
        live_update=[
            sync('./services/image-service/src', '/usr/src/app/src')
        ],
        only=[
            './services/image-service',
            './packages'
        ]
    )