# -*- mode: Python -*
load('ext://local_output', 'local_output')
load('ext://restart_process', 'docker_build_with_restart')

config.define_string_list("to-run", args=True)

allow_k8s_contexts('minikube-pollify')

docker_envs = local_output('minikube docker-env -p minikube-pollify --shell \'none\'')
for line in docker_envs.splitlines():
    key_value = line.split('=')
    os.putenv(key_value[0], key_value[1])


# def get_helm_args():
#     args = []
#     command_output = local_output('kip helmargs')[1:-1].strip().split('--set')
#     for arg in command_output:
#         args.append(arg.strip())
#     return args

# host = local_output('./scripts/ip.sh -h')

# k8s_yaml(helm('deployments/pollify',
#     name='pollify',
#     namespace='core',
#     values=['./deployments/values-dev.yaml'],
#     set=['global.serverHost='+host] + get_helm_args()
# ))

k8s_yaml('services/discord-service/deployments/service-deployment.yaml')

# local_resource('compile-protos', cmd='npm run build --prefix ./protos/', deps=['./protos/src/', './protos/dependencies/'])

cfg = config.parse()
to_run = cfg.get('to-run', [])

if 'discord' in to_run:
    docker_build(
        'eu.gcr.io/pollify-dev/discord-service',
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