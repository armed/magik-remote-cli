# magik-remote-cli package

A simple package which connects to GE SmallWorld 4.x session as Remote CLI client.

## Current features

* `f2 z` - connect to remote session
* `f2 b` - send buffer to remote SmallWorld session

SmallWorld session must be configured to listen for external connections by initializing `remote_cli` class. For example:

```
  MagikSF> remote_cli.new(14001, _proc @auth _return _true _endproc)
```

# WIP

This is alfa software. Many things needs to be done.
