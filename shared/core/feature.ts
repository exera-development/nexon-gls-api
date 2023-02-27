interface Feature<Request, Response> {
  execute(request: Request): Promise<Response> | Response
}

export default Feature
