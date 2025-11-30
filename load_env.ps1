 Get-Content ".env.local" | ForEach-Object {
      if ($_ -match '^\s*[^#]*=') {
          $name, $value = $_.Split('=', 2)
          $name = $name.Trim()
          $value = $value.Trim()
          if ($name -and $value) {
              [Environment]::SetEnvironmentVariable($name, $value)
          }
      }
  }
  