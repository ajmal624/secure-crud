#secure-crud

Unzip the File
use internet for all installation

Install Python 3.14, then verify the installation:
    Press Windows + R, type `cmd`, and press Enter.
    In Command Prompt, run:
        python --version

Install Node.Js, then verify the installation:
    Press Windows + R, type `cmd`, and press Enter.
    In Command Prompt, run:
        Node -v
		npm -v

Open Visual Studio Code and install the required Python, Node extensions.

Go to File → New Window → Open Folder, then select the `secure-crud` folder.

Open the terminal and run:
	cd backend
    py -m venv .venv
    venv\Scripts\Activate
    pip install -r requirements.txt
	python manage.py runserver
	Then create a '+' icon to create new terminal then type:
	cd frontend
	npm install
	npm install axios
	npm run dev

Run the output :
	login using username (admin) and password (12345678)
	Add Products
	Read the Products
	Update the products using Edit cmt
	Delete the products using delete cmt