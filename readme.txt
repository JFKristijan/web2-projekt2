URL aplikacije u oblaku: https://web2-projekt2.herokuapp.com/
Ostvarene ranjivosti: SQL umetanje (SQL Injection), Cross-site scripting (XSS), Lažiranje zahtjeva na drugom sjedištu (Cross Site Request Forgery, CSRF)

Pokretanje aplikacije:

1) Heroku - otici na url 'https://web2-projekt2.herokuapp.com/' u browseru
2) Lokalno pokretanje - raspakirati zip arhivu sa kodom
					  - instalirati sve dependencye poretanjem naredbe 'npm install' (podrazumijeva se da imate alat npm)
					  - izvrsiti naredbu 'npm start' ili 'node index.js' i ukoliko je pokretanje uspjelo u konzoli ce se prikazati 'Listening on 8080'
					  - aplikacija ce se pokrenuti na 'http://localhost:8080'
					  
Testiranje aplikacije:
	Postoje 3 linka koji vode na ranjivosti na navbaru zajedno sa gumbom 'Toggle security level' koji upravlja razinom sigurnosti
	Razina sigurnosti 0 predstavlja aplikaciju u ranjivom stanju, dok razina 1 onemogucuje ranjivosti
	1.SQL umetanje - unosom imena trazi se u bazi ntorka sa tim imenom (primjeri imena su 'qwert', 'azer', 'John', 'Rene',' Mark' -> za inicijalno testiranje)
		-> razina sigurnosti 0:
			-> implementirano: upit UNION i tautologija
			-> moguce za username unijeti tekst koji ce uzrokovati tautologiju te ispisati sve ntorke tablice
				->"'or'1'='1" bi bio tekst koji to radi (u dvostrukim navodnicima)
			-> moguce iskoristiti UNION kako bi se dohvatile ntorke i stupci do kojih je inace nemoguce doci samo pretragom korisnickog imena
				->"'union select username,password from users where '1'='1" je upit koji dohvaca korisnicka imena i njihove lozinke, moguce je i dohvatiti kredine kartice svakog korisnika na isti nacin
				->"'union select username,credit_card from users where '1'='1"
				->"'union select username,status from statuses where '1'='1" je upit koji bi onda dohvatio informacije iz tablice koja se koristi za CSRF ranjivost
				
		-> razina sigurnosti 1:
			-> ranjivost je onemogucena koristenjem prepared statementa, niti jedna od gore navedenih naredbi ne vraca nikakav rezultat
			-> normalno trazenje radi
			
	2. Cross-site scripting (XSS)
		-> razina sigurnosti 0:
			-> u primjeru reflektirani XSS sa unosenjem koda pomocu script taga
			-> u polje za ime moguce unijeti  kod koji ce se izvrsiti nakon pritiska na gumb 'Greet!'
			-> postize se tako da se unese "<script>alert('Hello from XSS!')</script>" cijim ce se izvrsavanjem prikazati alert sa tekstom "Hello from XSS!"
		-> razina sigurnosti 1:
			-> koristenjem validacije unosa ranjivost je onemogucena
			-> unosom "<script>alert('Hello from XSS!')</script>" dobivamo samo taj tekst vracen natrag bez njegovog izvrsavanja kao javascript kod
			
	3. Cross Site Request Forgery
		-> razina sigurnosti 0:
			-> kako bi se demonstrirala ranjivost potrebno je definirati svoje korisnicko ime unosom istog u formu, nakon toga pojaviti ce se druga forma za 
				unos statusa, sada korisnik otvara "Kliknite ovdje na definitivno ne sumnjiv link za memeove" link gdje mu se prikazuje stranica sa slikama 
				medu kojima su skriveni u dva img cvora zahtjevi koji dodaju maliciozne statuse kao taj korisnik, povratkom na csrf stranicu oni su vidljivi u tablici statusa
		-> razina sigurnosti 1:
			-> ranjivost je onemogucena koristenjem post zahtjeva za dodavanje statusa umjesto get zahtjeva