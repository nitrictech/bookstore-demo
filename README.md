# Comparison of Terraform and Nitric

This is the beginnings of a cloud application with two services bound by a pub/sub topic. It forms the basis for an e-commerce site, which serves as a comparison between Nitric and using more explicit IaC to deploy cloud infrastructure and reference it in code. This repository contains two applications, one written with Nitric and the other with HCL (Terraform). If you'd prefer a visual version of this guide you can watch the video below.

<div class="video-container">
  <iframe
    src="https://www.youtube-nocookie.com/embed/_n8S0IYxmSM"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  ></iframe>
</div>

The application code will have be kept pretty simple as we are mainly focused on the infrastructure code differences. There will be two services, one for handling user submitted orders, and one for generating invoices for those orders. There will be a topic which binds these two services together and a bucket which will store the generated orders.

To get this running in Azure we will need to create the following resources:

- Resource Group (for logical grouping)
- 2 Container Apps
- Container Registry (to store container images)
- Container App Environment (to run the container apps)
- EventGrid Topic
- Storage Account (to configure the storage container)
- Storage Container
- IAM rules (to implement least-privilege)

<img src="./assets/azure-example.svg" width="1000px"/>

For an application built using traditional Infrastructure as Code (IaC) tooling like Terraform, each of these resources needs to be individually defined, configured, and bound to the application code. Using a more Infastructure _from_ Code approach like Nitric, the resources are defined in your application code.

Each of the applications, located in the `nitric` and `terraform` directories, have almost identical application code. However, the terraform code requires an additional ~300 lines, exclusively to define infrastructure, not behaviour.
