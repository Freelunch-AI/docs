## AI Sandbox Spec

I need you to build a python library (SDK), called sandox, which lets users send actions specifications to be executed in a container sandbox
and receive observations generated. To make this library work you will first have to: (1) build the sansdbox: containerized http API that will be listening
to action executing requests from the SDK, will execute the actions and return observations generated as a response to the SDK, and (2) build the sandox orchestrator: containarized http API that will be listeining to sandox creation, deletion and will execute these tasks; the sandox orchestrator will also start and initially populates all databases which can be used by all sandboxes (if the user allows the sandox to access the specific databases).The orchestrator will need to deploy each database as a seprate containarized service

Notatation: i will use bold notation * * around text to denote it is the name of a specific software packages: e.g., *uv* is the uv package manager, *python* is the python programming language, etc.

Now I will give you details what exactly I want and on how to do this:

1. The example below shows the interface I'm expecting for the python library (SDK):

    from sandbox import SandboxGroup

    sandboxggoup = SandboxGroup(database_access = DatabaseAccess, compute_resources=ComputeResources, tools=tools , intial_database_population_config=intial_database_population_config.yml) # where DatabaseAccess is a data object describing the default database access (read and/or write rights for which namespace of each database) for each sanbox of the group (e.g., acess to vector database and search database); you can fully specify all the initial sandoxes and their acess rights and the default database acces right for a sandox created under thi group dynamically. ComputeResources and is the same thing but from Compute Resources of the sanboxes. tools is a list of default tools (python functions) that should be put inside the dynamically created dockerfile of the sandbox (which then needs to be dynamically built), under the same file name of the file it is currently in. Finally, intial_database_population_config.yml is a file pointing to the data to initally populate each database. which can point to local or remote files.

    sandboxggoup.start_sandbox_group() # starts the statically created group of sandboxes, the static created group of sandoxes is actually running, which means it can receive action execution requests from the SDK

    sandbox = sandboxgroup.create_sandbox(id=id, tools=tools, compute_resources=ComputeResources, attached_databases=AttachedDatabases) # creates a sandbox with a specific id and provides tools,which is a list of tools (python functions) that should be put inside the  sandbox, under the same file name of the file it is currently in. A tpyical pattern would be 4 .py files: filesystem_tools.py, terminal_tools.py, web_tools.py and database_tools.py with a bunch of functions inside of them. When the sandox receives and requestion request, it will look the specified function (specified in the request) in these files, then execute it, produce an observation object (standard output: str, standard error: str, terminal_still_running: bool) and return the observation object to the SDK. It also receives the pydantic model ComputeResources that specifies the virtual hardware available for the sandox: amount of disk, RAM, CPU cores and memoery bandwith; in absolute (exact amount of resurces) or relative (% of total machine resources) manner.

    sandbox.start() # starts the dynamically created sandbox, now the sandox is actually running, which means it can receive action execution requests from the SDK

    observations = # sanbox.send_actions(actions) # send actions to be executed in the sandbox and waits for observations syncronously

    observations2 = await sandbox.send_actions(actions, async=True) # send actions to be executed in the sandbox, doesnt't wait for observations

    sandobox.end() # ends the sandbox

2. About actions

4 types of actions must be supported:

- Filesystem actions:
    - how are they executed? filesystem_tools.py with a function for each action
    - examples:
        - read file, create file, delete file, append to file, overwrite file, move file, copy/paste file, etc
- Terminal actions:
    - how are they executed? terminal_tools.py with a function for each action
    - examples:
        - change current working directory
        - use *uv* to add packages to a python project, install those packages, remove packages and run python scripts
- Web actions:
    - how are they executed? web_tools.py with a function for each action
    - examples:
        - scrape entire website: generate a markdown containing all the content of a website from its URL
        - web search: use a websearch API (e.g., Google's API) to get the most relevant URLs for a specific query
        - get specific fields of data of a website via browser automation
- Database actions:
    - how are they executed? database_tools.py with a function for each action
    - examples:
        - query (read and/or write) a hybrid vector+keyword-search database, query (read and/or write) a graph database

3. Specific software packages you need to use (unless you have a really good reson not to use them):

- *uv*: as a package manager: for installing packages, defining project dependencies, etc
- *Docker*: for containarization
- *AWS S3*: for the data lake
- *FastAPI* + *Uvicorn*: for making python http APIs
- *Qdrant*: for hybrid vector+keyword-search database
- *Neo4J*: for graph database
- *Playwright*: for browser automation
- *Scrapy or *Firecrawl**: for scraping
- *bash*: for terminal commands
- *Python's os.path built-in package*: for filesystem interaction
- *Pydantic*: for makinf better data classes which validate data at creation
and when passing data between functions

4. How you should build it

You should follow these principles:

- Simplicity: try to keep it as simple as posssible
- Modularity: separate functionality by modules with clear boundaries/data contracts between them. Use multiple files instead of making very big files
- Security: avoid security bad practices (e.g., putting secrets in the middle of the code)
- Testing: make tests that ensure your code is doing whats its expected to do
- Readability: make clean & well documented code
- Documentation: produce a a tutorial explaining all the code you produced
- Dummy Data: you should use dummy data to emulate real data

5. The action execution request payload

The payload of the action executing request will be a json that looks like this:

{
    <function_name1>Use: {
        <function_call_explantion1>:
        <args1>: {
            <arg11name>:
            <arg12name>:
            ...
            <arg1Mname>:
        }
    },

    <function_name2>Use: {
        <function_call_explantion2>:
        <args2>: {
            <arg21name>:
            <arg22name>:
            ...
            <arg2Mname>:
        }
    },

    ...

    <function_nameN>Use: {
        <function_call_explantionN>:
        <argsN>: {
            <argN1name>:
            <argN2name>:
            ...
            <argNMname>:
        }
    },

}

where text in between <> denotes a string variable that will be known at request-time.

6. Remember: the dockerfile of the sandox need to be edited dynamically, to put user requested tools on top of the default sandox dockerfile.