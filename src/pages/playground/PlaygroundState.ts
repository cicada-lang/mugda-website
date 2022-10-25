import {
  Parser,
  ParsingError,
  BlockResource,
  Mod,
  Loader,
} from '@cicada-lang/lambda'

const loader = new Loader()

export class PlaygroundState {
  mod = new Mod(new URL(window.location.href), {
    loader,
    blocks: new BlockResource(),
  })

  text = ''
  error?: {
    kind: string
    message: string
  }

  get outputs(): Array<undefined | string> {
    return this.mod.blocks.outputs
  }

  async refresh(url: URL): Promise<void> {
    try {
      delete this.error
      this.mod = await loader.loadAndExecute(url, { code: this.text })
    } catch (error) {
      this.catchError(error)
    }
  }

  catchError(error: unknown): void {
    if (!(error instanceof Error)) throw error
    if (error instanceof ParsingError) {
      this.error = {
        kind: 'ParsingError',
        message: error.message + '\n' + error.span.report(this.text),
      }
    } else {
      this.error = {
        kind: error.name,
        message: error.message,
      }
    }
  }
}
