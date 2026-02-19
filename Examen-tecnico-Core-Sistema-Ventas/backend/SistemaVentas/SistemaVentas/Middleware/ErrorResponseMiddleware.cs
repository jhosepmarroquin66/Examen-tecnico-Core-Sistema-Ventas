namespace SistemaVentas.Middleware
{
    public class ErrorResponseMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorResponseMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                var response = new
                {
                    error = "Error interno en el servidor",
                    detalle = ex.Message // En producción esto se oculta, pero para tu examen es útil
                };

                await context.Response.WriteAsJsonAsync(response);
            }
        }
    }
}