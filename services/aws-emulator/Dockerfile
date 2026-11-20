# Dockerfile for AWS Emulator based on official AWS documentation:
# https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html

FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal

# Architecture: 'x86_64' (Intel/AMD) or 'aarch64' (ARM / Apple Silicon)
ARG ARCH=x86_64

# Download and install the official AWS Emulator LTS RPM package
ADD https://downloads.aws.com/aws-emulator/packages/aws-emulator/LTS/latest/aws-emulator-${ARCH}.rpm /tmp/aws-emulator.rpm

RUN rpm -i /tmp/aws-emulator.rpm && rm /tmp/aws-emulator.rpm \
    && mkdir -p /home/emulator && chown 1000:1000 /home/emulator

USER 1000
ENV HOME=/home/emulator
EXPOSE 9297

# Entrypoint binds to 0.0.0.0 so Docker can route host traffic to the container
ENTRYPOINT ["aws-emulator", "-b", "0.0.0.0"]

# Default command specifies port 9297
CMD ["-p", "9297"]
