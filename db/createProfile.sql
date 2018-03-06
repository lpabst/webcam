insert into frusers 
(username, password)
values($1, $2)
returning id