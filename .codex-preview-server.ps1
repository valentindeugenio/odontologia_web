$ErrorActionPreference = "Stop"
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:4173/")
$listener.Start()

$contentTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "text/javascript; charset=utf-8"
    ".webp" = "image/webp"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $relativePath = $context.Request.Url.AbsolutePath.TrimStart("/")
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            $relativePath = "index.html"
        }

        $requestedPath = [System.IO.Path]::GetFullPath(
            [System.IO.Path]::Combine($root, $relativePath)
        )

        if (
            -not $requestedPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -or
            -not [System.IO.File]::Exists($requestedPath)
        ) {
            $context.Response.StatusCode = 404
            $context.Response.Close()
            continue
        }

        $extension = [System.IO.Path]::GetExtension($requestedPath).ToLowerInvariant()
        if ($contentTypes.ContainsKey($extension)) {
            $context.Response.ContentType = $contentTypes[$extension]
        }
        else {
            $context.Response.ContentType = "application/octet-stream"
        }

        $bytes = [System.IO.File]::ReadAllBytes($requestedPath)
        $context.Response.ContentLength64 = $bytes.Length
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        $context.Response.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
}
