# Regenerate: vhs docs/tapes/ge-init.tape (writes docs/assets/tapes/ge-init.gif)
#
# `ge init` writes REPO_ROOT/.ge.json unconditionally (tools/lib/state-paths.mjs
# resolves REPO_ROOT from the module location, not the shell's cwd — running
# this tape from elsewhere would not sandbox it). A contributor with their own
# real .ge.json would have it clobbered by the demo project below, so this
# tape backs it up before recording and restores it (or removes the demo one
# if none existed) after — hidden, so the visible recording is still just
# `ge init --project ge-agent-factory-demo`.
Output docs/assets/tapes/ge-init.gif

Set FontFamily "Geist Mono"
Set FontSize 20
Set Width 1200
Set Height 640
Set Padding 24
Set Theme {"name": "ge", "black": "#202124", "red": "#c5221f", "green": "#34a853", "yellow": "#f9ab00", "blue": "#4285f4", "magenta": "#a142f4", "cyan": "#1a73e8", "white": "#f8fafd", "brightBlack": "#5f6368", "brightRed": "#c5221f", "brightGreen": "#34a853", "brightYellow": "#f9ab00", "brightBlue": "#4285f4", "brightMagenta": "#a142f4", "brightCyan": "#1a73e8", "brightWhite": "#ffffff", "background": "#202124", "foreground": "#f8fafd", "cursor": "#1a73e8", "selection": "#3c4043"}

Hide
Type "[ -f .ge.json ] && cp .ge.json .ge.json.tape-backup || rm -f .ge.json.tape-backup"
Enter
Type "clear"
Enter
Show

Type "ge init --project ge-agent-factory-demo"
Enter
Sleep 15s

Hide
Type "if [ -f .ge.json.tape-backup ]; then mv .ge.json.tape-backup .ge.json; else rm -f .ge.json; fi"
Enter
