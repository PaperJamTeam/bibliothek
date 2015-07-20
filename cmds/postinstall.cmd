@IF EXIST "%~dp0node.exe" (
  call "%~dp0node.exe"  "%~dp0..\node_modules\bower\bin\bower" "install"
  call "%~dp0node.exe"  "%~dp0..\node_modules\tsd\build\cli.js" "reinstall" "-so"
) ELSE (
  call node "%~dp0..\node_modules\bower\bin\bower" "install"
  call node "%~dp0..\node_modules\tsd\build\cli.js" "reinstall" "-so"
)
