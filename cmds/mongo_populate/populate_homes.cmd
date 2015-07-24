@echo off
where mongoimport /q

IF "%ERRORLEVEL%" == "0" (
	call mongoimport --host localhost --port 27017 --collection homes --db bibliothek --jsonArray --file ./homes_data.json --verbose
) ELSE (
	echo Cannot find `mongoimport`
)
