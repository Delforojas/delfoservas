#!/bin/sh
set -e

cd /var/www/app

echo "CHECK Symfony project"

if [ ! -e public/index.php ]; then
  echo "Creating Symfony project..."
  if [ -n "$SYMFONY_PARAMS" ]; then
    symfony new . $SYMFONY_PARAMS
  else
    symfony new . $SYMFONY_PARAMS_STD
  fi
fi

echo "Installing Composer dependencies..."
composer install

echo "Waiting for database..."
until php bin/console doctrine:query:sql "SELECT 1" > /dev/null 2>&1; do
  echo "DB not ready, waiting..."
  sleep 2
done
echo "DB connected"

echo "Running migrations..."
php bin/console doctrine:database:create --if-not-exists --no-interaction

set +e
php bin/console doctrine:migrations:migrate --no-interaction --all-or-nothing
MIGRATION_STATUS=$?
set -e

if [ "$MIGRATION_STATUS" -ne 0 ]; then
  echo "Migrations failed. Falling back to doctrine:schema:update --force"
  php bin/console doctrine:schema:update --force --no-interaction || true
fi

echo "Ensuring schema is up to date with entities..."
php bin/console doctrine:schema:update --force --no-interaction || true

echo "Creating admin..."
if php bin/console app:create-admin; then
  echo "Admin created"
else
  echo "Admin already exists or creation failed (ignored)"
fi

echo "STARTING APACHE"
exec "$@"
