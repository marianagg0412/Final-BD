--Basic queries
--1
SELECT * FROM comics WHERE price < 20
ORDER BY title;

--2
SELECT * FROM characters
                  INNER JOIN characterxpower ON characters.id = characterxpower.characterid
                  INNER JOIN public.powers p on p.id = characterxpower.powerid
WHERE type = 'Hero' AND p.name ILIKE '%flight%';

--Medium queries
--1
SELECT * FROM characters WHERE defeats > 3 AND type = 'Villain'; --Defeats are always made by the opposite side

--2
SELECT customerid, SUM(C.price) as total_purchase_value
FROM transactions
         INNER JOIN public.comics c on c.id = transactions.comicid
GROUP BY customerid
HAVING COUNT(transactions.comicid) > 5
ORDER BY total_purchase_value DESC;

--Advanced queries
--1
SELECT C2.name, COUNT(*) AS most_popular FROM transactions
                                                  INNER JOIN public.comics c on c.id = transactions.comicid
                                                  INNER JOIN public.categories c2 on c2.id = c."categoryId"
GROUP BY C2.name ORDER BY most_popular DESC;

--2
SELECT * FROM characters
                  INNER JOIN public.groups g on g.id = characters.groupid
WHERE G.name = 'Avengers' OR G.name = 'Justice League';

--3
SELECT DISTINCT comics.id, comics.title, comics.description FROM comics
                                                                     INNER JOIN public.comicxcharacter c on comics.id = c.comicid
                                                                     INNER JOIN public.characters c2 on c2.id = c.characterid
                                                                     INNER JOIN public.weapons w on c2.id = w.characterid
WHERE comics.description ILIKE '%epic hero-villain battle%'
GROUP BY comics.id;


