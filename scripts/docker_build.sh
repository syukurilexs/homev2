cd ../
docker build --pull --rm -f "Dockerfile" -t syukurilexshome:latest "." 
docker tag syukurilexshome:latest syukurilexs/home:latest
docker push syukurilexs/home:latest

# Change the version before run
version=2.0.0
docker build --pull --rm -f "Dockerfile" -t syukurilexshome:$version "." 
docker tag syukurilexshome:latest syukurilexs/home:$version
docker push syukurilexs/home:$version