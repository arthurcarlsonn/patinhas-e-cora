
-- Função para incrementar contagem de visualizações
CREATE OR REPLACE FUNCTION increment_views(table_name text, row_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET views = views + 1 WHERE id = %L', table_name, row_id);
END;
$$ LANGUAGE plpgsql;
