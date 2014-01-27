describe "XBlock.runtime.v1", ->
  beforeEach ->
    setFixtures """
      <div class='xblock' data-handler-prefix='/xblock/fake-usage-id/handler'/>
    """
    @children = [
      {name: 'childA'},
      {name: 'childB'}
    ]

    @element = $('.xblock')[0]

    @runtime = XBlock.runtime.v1(@element, @children)
  it "provides a handler url", ->
    expect(@runtime.handlerUrl(@element, 'foo')).toBe('/xblock/fake-usage-id/handler/foo')

  it "provides a list of children", ->
    expect(@runtime.children).toBe(@children)

  it "maps children by name", ->
    expect(@runtime.childMap.childA).toBe(@children[0])
    expect(@runtime.childMap.childB).toBe(@children[1])
