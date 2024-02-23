# vite-template-redux

Uses [Vite](https://vitejs.dev/), [Vitest](https://vitest.dev/), and [React Testing Library](https://github.com/testing-library/react-testing-library) to create a modern [React](https://react.dev/) app compatible with [Create React App](https://create-react-app.dev/)

## Prerequisites

- `node -v 19.0.0`

## Scripts

- `dev`/`start` - start dev server and open browser
- `build` - build for production
- `preview` - locally preview production build
- `test` - launch test runner

## use .env.local for local meachine, which would be a copy of any of evn file

## Inspiration

- [Create React App](https://github.com/facebook/create-react-app/tree/main/packages/cra-template)
- [Vite](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react)
- [Vitest](https://github.com/vitest-dev/vitest/tree/main/examples/react-testing-lib)

## Mock

- `npm install -g mockserver` - Install mock server locally
- `mockserver -p 8080 -m mocks/` - Run this comming to start the mock server

## Icons

- [material-icons](https://mui.com/material-ui/material-icons/)

## fonts

- [Work Sans](https://www.npmjs.com/package/@fontsource/work-sans)
- [Merriweather](https://www.npmjs.com/package/@fontsource/merriweather)

## Dialog Box used commonly named <CustomizedDialogsBox/>

### need to pass following params

```
title: string
subTitle: string
children?: React.ReactNode
open: boolean
handleClose: () => void
handleSubmit?: () => void

```
test

## DatePicker

- [Date picker](https://mui.com/x/react-date-pickers/date-picker/)

## popup

- using [Sweet Alert](https://sweetalert2.github.io/)
