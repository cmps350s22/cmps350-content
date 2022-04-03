Before you can run the example, make sure that you:
•	Download and install MongoDB available https://www.mongodb.org/downloads
I recommend installing MongoDB in C:\mongodb (during the installation choose Custom and select C:\mongodb as the installation destination)
You may add C:\MongoDB\bin\ to the Path System Variable.
Create the following folder: C:\data\db  . You may use mkdir c:\data\db   (this is where MongoDB will create the databases)

•	Install other packages using Webstorm terminal window
npm install

To start MongoDB server, Open a commond line then:
cd "C:\MongoDB\bin"   (!!!use the path where you installed MongoDB)
mongod
