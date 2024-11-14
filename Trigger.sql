--Trigger implementation
CREATE TABLE special_offers(
                              id SERIAL PRIMARY KEY,
                              usuario_id INT NOT NULL,
                              date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION special_comic_offer() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT title FROM comics WHERE id = NEW.comicId) = 'Superman en Calzoncillos con Batman Asustado' THEN
        INSERT INTO special_offers (usuario_id) VALUES (NEW.customerId);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER special_comic_offer_trigger
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION special_comic_offer();
