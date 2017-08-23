#! /usr/bin/env bash

apt-get update && apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib


# symlink libs to where Xvfb searches
ln -s /lib/x86_64-linux-gnu/libudev.so.1 $1/.apt/usr/lib/libudev.so.0
ln -s /app/.apt/usr/lib/x86_64-linux-gnu/libXfont.so.1 $1/.apt/usr/lib/libXfont.so.1

# patch Xvfb to use /app/.. paths instead of hardcoded wrong values
sed -i.bak s/usr\\/bin/app\\/ubi/g $1/.apt/usr/bin/Xvfb
sed -i.bak s/usr\\/share\\/fonts/app\\/usr-s-fonts/g $1/.apt/usr/bin/Xvfb
# create symlinks for Xvfb to use /app/.apt/usr/...
ln -s /app/.apt/usr/bin $1/ubi
ln -s /app/.apt/usr/share/fonts $1/usr-s-fonts

# run mkfontdir with binaries from inside dyno
export PATH="$PATH:$1/.apt/usr/bin"
export LD_LIBRARY_PATH="$LD_LIBRARY_PATH:$1/.apt/usr/lib:$1/.apt/usr/lib/x86_64-linux-gnu"
find $1/.apt/usr/share/fonts/X11 -type d | xargs $1/.apt/usr/bin/mkfontdir