cd /root/

until npm run start; do
    echo "cctv-recorder died with code $?.  Respawning.." >&2
    sleep 1
done
