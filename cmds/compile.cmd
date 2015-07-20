@echo off
set TYPESCRIPT=""
where tsc /q

IF "%ERRORLEVEL%" == "0" (
	set TYPESCRIPT="tsc"
) ELSE (
	set TYPESCRIPT="%~dp0node_modules\typescript\bin\tsc"
)

IF EXIST "%~dp0node.exe" (
	call "%~dp0node.exe" %TYPESCRIPT% "--sourcemap" "--module" "commonjs" "bin\www.ts"
) ELSE (

	call %TYPESCRIPT% "--sourcemap" "--module" "commonjs" "bin\www.ts"
)
