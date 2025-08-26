// Initialize the database
let db;

async function initDB() {
  const SQL = await window.initSqlJs({
      locateFile: file => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.wasm'
  });

  const savedDB = localStorage.getItem("sqlite_db");
  if (savedDB) {
      db = new SQL.Database(new Uint8Array(atob(savedDB).split("").map(c => c.charCodeAt(0))));
      console.log("DataBase Loaded From Local Storage")
  } else {
      db = new SQL.Database();
      createTable();
      console.log("New SqlLite DataBase Created")
  }
  localStorage.setItem("dbInitialized", "true");
}

initDB()


function createTable() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            password TEXT
        );
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS purchases (
          purchase_id INTEGER,
          user_id INTEGER ,
          course_name TEXT,
          price REAL,
          FOREIGN KEY (user_id) REFERENCES users (id)
      );
  `);
}

function saveDB() {
    const data = db.export();
    const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
    localStorage.setItem("sqlite_db", base64);
}

function addUser() {
    if (!db) {
        alert("Database not initialized!");
        return;
    }

    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (!name || !email || !password) {
        alert("User data not found in localStorage!");
        return;
    }

    db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);

    saveDB();

    alert("User added successfully!");
}


function getUser() {
  if (!db) {
      alert("Database not initialized!");
      return;
  }

  const users = db.exec("SELECT * FROM users");
  let outputText = "Users in Database:\n";

  if (users.length > 0) {
      const userList = users[0].values; 

      for (let i = 0; i < userList.length; i++) {
          let user = userList[i];
          outputText += `ID: ${user[0]}, Name: ${user[1]}, Email: ${user[2]}, Password: ${user[3]}\n`;
      }
  } else {
      outputText += "No users found.";
  }

  console.log(outputText);
}


document.addEventListener("DOMContentLoaded", async function () {
  await initDB();

  if (localStorage.getItem("enrolled") === "true") {
      let x=localStorage.getItem("pur_item")
      for(var i=1;i<=x;i++){
        db.run(
          `INSERT INTO purchases (purchase_id,user_id,course_name, price)
           SELECT ?, ?, ?,?
           WHERE NOT EXISTS (SELECT 1 FROM purchases WHERE purchase_id = ?)`, 
          [
            i,
            localStorage.getItem("userName")+i,
            localStorage.getItem("purchased" + i),
            localStorage.getItem("price" + i),
            i
          ]
        );
      }
      saveDB();
      getUser();
      const purchases = db.exec("SELECT * FROM purchases");
      let outputText = "Courses in Database:\n";

      for (let i = 0; i < purchases[0].values.length; i++) {
          let purchase = purchases[0].values[i];
          outputText += `ID: ${purchase[0]}, user_id: ${purchase[1]}, Course: ${purchase[2]}, Price: ${purchase[3]}\n`;
      }

      console.log(outputText);
  }
});

function emptying(){
  db.run(`DROP TABLE IF EXISTS users;`)
  db.run(`DROP TABLE IF EXISTS purchases;`)
  alert("Logged Out Successfully")
}
function clearDB() {
    localStorage.removeItem("sqlite_db");
    db = null;
    alert("Database cleared from localStorage.");
}


// individual offer
function ind(){
  document.getElementById("individual").style.display="block"
  document.getElementById("groupOffers").style.display="none"
}

// group offer
function grp(){
  document.getElementById("individual").style.display="none"
  document.getElementById("groupOffers").style.display="block"
}


// const loginButton1 = document.getElementById('login1');
// const loginButton2 = document.getElementById('login2');
// const loginButton3 = document.getElementById("login3")
// const loginModal = document.getElementById('loginModal');
// const closeModalButton = document.getElementById('closeModal');

document.addEventListener("DOMContentLoaded", () => {
  const loginButton1 = document.getElementById("login1");

  if (loginButton1) {
    loginButton1.addEventListener("click", () => {
      if (localStorage.getItem("isLoggedIn") === "true") {
        // window.open('feedback.html', '_blank');
      } else {
        const loginModal = document.getElementById("loginModal");
        if (loginModal) {
          loginModal.style.display = 'flex';
        } else {
          console.error("loginModal not found in the DOM");
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginButton2 = document.getElementById("login2");

  if (loginButton2) {
    loginButton2.addEventListener("click", () => {
      if (localStorage.getItem("isLoggedIn") === "true") {
        // window.open('feedback.html', '_blank');
      } else {
        const loginModal = document.getElementById("loginModal"); 
        if (loginModal) {
          loginModal.style.display = 'flex';
        } else {
          console.error("loginModal not found in the DOM");
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginButton3 = document.getElementById("login3");

  if (loginButton3) {
    loginButton3.addEventListener("click", () => {
      const loginModal = document.getElementById("loginModal"); 
      if (loginModal) {
        loginModal.style.display = 'flex';
      } else {
        console.error("loginModal not found in the DOM");
      }
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const closeModalButton = document.getElementById("closeModal");

  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      const loginModal = document.getElementById("loginModal"); 
      if (loginModal) {
        loginModal.style.display = 'none';
      } else {
        console.error("loginModal not found in the DOM");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const loginModal = document.getElementById("loginModal");

  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = 'none';
      }
    });
  }
});


// Login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Login form submitted!');
      
      const loginModal = document.getElementById('loginModal');
      if (loginModal) {
        loginModal.style.display = 'none';
      }

      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const pass = document.getElementById('password')?.value;
      
      if (name && email && pass) {
        const date = new Date();
        localStorage.setItem("loginYear", date.getFullYear());
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", name);
        localStorage.setItem("email", email);
        localStorage.setItem("password", pass);
        
        addUser();
        getUser();
        
        const loginButton3 = document.getElementById('login3');
        if (loginButton3) {
          loginButton3.style.display = 'none';
        }
        
        const profileSection = document.getElementById('profileSection');
        if (profileSection) {
          profileSection.style.display = 'block';
        }

        const profileName = document.getElementById('profileName');
        if (profileName) {
          profileName.innerHTML = name;
        }
      } else {
        console.error("Name, email, or password is missing.");
      }
    });
  }
});



// Profile logout
function handleLogout() {
  document.getElementById('login3').style.display = 'block';
  document.getElementById('profileSection').style.display = 'none';
  document.getElementById('loginForm').reset();
  localStorage.clear()
  emptying()
}

// AI-courses functiona
function validation() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("email");
    const pass = localStorage.getItem("password");
    console.log(name, email, pass);

    if (name && email && pass) {
      document.getElementById("fname").value = name;
      document.getElementById("femail").value = email;
      document.getElementById("fpassword").value = pass;

      document.getElementById("fname").setAttribute("disabled", "true");
      document.getElementById("femail").setAttribute("disabled", "true");
      document.getElementById("fpassword").setAttribute("disabled", "true");
    }
  }
  else{
    alert("Login First Redirecting to Main Page")
    window.open("mainpage.html","_self");
    selectlogout();
    window.close();
  }
}
function selectlogout(){
  localStorage.removeItem("price")
  localStorage.removeItem("selected_course")

}

// courses
function control(){
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("email");
  const pass = localStorage.getItem("password");
  window.open("mainpage.html")
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("isLoggedIn") === "true") {
      const storedName = localStorage.getItem("userName");
  
      if (storedName) {
        const login3 = document.getElementById('login3');
        const profileSection = document.getElementById('profileSection');
        const profileName = document.getElementById('profileName');
  
        if (login3) {
          login3.style.display = 'none';
        }
        if (profileSection) {
          profileSection.style.display = 'block';
        }
        if (profileName) {
          profileName.innerHTML = storedName;
        }
      }
    }
  });
  

function certificatess(){
  if(localStorage.getItem("pur_item")>0){
    window.open("records","_self")
  }
  else{
    alert("No Certificates Assigned To You")
  }
}