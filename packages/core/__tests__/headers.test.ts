import { ContentType, find, findContentType } from '../src/utils/headers'

describe('find', () => {
  it('handles exact match', () => {
    expect(find('something', { something: 'great' })).toEqual('great')
  })

  it('handles case and spaces', () => {
    expect(find('   somETHiNg   ', { '  SOMethiNG ': 'great' })).toEqual(
      'great'
    )
  })

  it('normalize results', () => {
    expect(find('something', { something: ' Very   AwEsOmE   ' })).toEqual(
      'very   awesome'
    )
  })
})

describe('findContentType', () => {
  it('handles exact JSON content type', () => {
    expect(
      findContentType({
        'content-type': 'application/json'
      })
    ).toBe(ContentType.JSON)
  })

  it('handles exact TEXT content type', () => {
    expect(
      findContentType({
        'content-type': 'text/plain'
      })
    ).toBe(ContentType.TEXT)
  })

  it('handles application content type', () => {
    expect(
      findContentType({
        'content-type': 'application/binary'
      })
    ).toBe(ContentType.APPLICATION)
  })

  it('handles case and spaces', () => {
    expect(
      findContentType({
        '   CONteNt-TyPE   ': ' AppLICaTion/JsOn   '
      })
    ).toBe(ContentType.JSON)
  })

  it('fallback to any when there is no content type', () => {
    expect(findContentType({})).toBe(ContentType.ANY)
  })

  it('fallback to any when content type is unknown', () => {
    expect(findContentType({ 'content-type': 'some-unknown-type' })).toBe(
      ContentType.ANY
    )
  })
})
