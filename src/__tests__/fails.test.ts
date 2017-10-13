it.skip('Fails 1', () => {
  expect(1).toEqual(2)
})

it.skip('Fails 2', () => {
  expect(' asdasd').toBeLessThanOrEqual(2)
})

it.skip('Fails 4', () => {
  expect({ a: 'asda'}).toBeFalsy()
})
