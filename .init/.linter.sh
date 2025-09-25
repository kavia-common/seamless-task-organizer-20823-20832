#!/bin/bash
cd /home/kavia/workspace/code-generation/seamless-task-organizer-20823-20832/to_do_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

