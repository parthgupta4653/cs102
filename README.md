- can pull main branch for just frontend

- All html files are in views folder with extension .ejs for nodejs
- put all corresponding css and frontend js in public folder
- for backend, implement in server.js file in root folder
- make sure to have mysql server running before turning on server

# Instructions to implement

- download a mysql server app (I use Xampp)
- download nodejs
- in cmd on folder path type "npm init -y", then type "npm i bcrypt ejs express express-flash express-session method-override mysql passport passport-local" to install all dependencies
- To run server type npm run start
- password for both accounts is "123"
  
- db name "cs102"
- table name "user"

- data in the db currently:-
<table>
<thead>
<tr>
<th>id</th>
<th>name</th>
<th>email</th>
<th>hashedpassword</th>
<th>type</th>
<th>subjects</th>
<th>batch</th>
<th>branch</th>
</tr>
</thead>
<tbody><tr>
<td>1</td>
<td>student1</td>
<td><a href="mailto:student1@mail.com">studentl@mail.com</a></td>
<td>$2b$05$fz0jr3ZC8/qgNj1RogjkEO7ecvjPZBCkiqpQ.YtmsB4kPHnUZizYu</td>
<td>student</td>
<td>MA102 CS102 EE101</td>
<td>2023</td>
<td>CSE</td>
</tr>
<tr>
<td>2</td>
<td>student2</td>
<td><a href="mailto:student2@mail.com">student2@mail.com</a></td>
<td>$2b$05$fz0jr3ZC8/qgNj1RogjkEO7ecvjPZBCkiqpQ.YtmsB4kPHnUZizYu</td>
<td>student</td>
<td>MA102 NO101 CS102</td>
<td>2024</td>
<td>EE</td>
</tr>
</tbody></table>











