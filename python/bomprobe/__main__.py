"""Allow running bomprobe as: python -m bomprobe <args>"""

import sys
import subprocess
from . import _find_bomprobe


def main():
    cmd = _find_bomprobe()
    cmd.extend(sys.argv[1:])
    result = subprocess.run(cmd)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
