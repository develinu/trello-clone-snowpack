<script>
  import { onDestroy, tick, createEventDispatcher } from 'svelte'
  import { autoFocusout } from '~/actions/autoFocusout'
  import { cards } from '~/store/list'

  export let listId

  const dispatcher = createEventDispatcher()

  let isEditMode = false
  let title = ""
  let textareaEl

  function addCard() {
    if (title.trim()) {
      cards.add({
        listId,
        title,
      })
    }
    offEditMode()
  }

  async function onEditMode() {
    isEditMode = true
    dispatcher("editMode", true)
    title = ""
    await tick()
    textareaEl && textareaEl.focus()
  }

  function offEditMode() {
    isEditMode = false
    dispatcher("editMode", false)
  }
   
  onDestroy(() => {
    offEditMode()
  })
</script>

{#if isEditMode}
  <div 
    use:autoFocusout={offEditMode}
    class="edit-mode">
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this card..."
      on:keydown={e => {
        e.key === "Enter" && addCard()
        e.key === "Escape" && offEditMode()
        e.key === "Esc" && offEditMode()
      }}></textarea>
      <div class="actions">
        <div 
          class="btn success"
          on:click={addCard}>
          Add Card
        </div>
        <div 
          class="btn danger"
          on:click={offEditMode}>
          Cancel
        </div>
      </div>
  </div>
{:else}
  <div 
    class="add-another-card"
    on:click={onEditMode}>
    + Add another card
  </div>
{/if}

<style lang="scss">
  .add-another-card {
    padding: 4px 8px;
    font-size: 14px;
    color: #5e6c84;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background-color: rgba(9, 30, 66, .08);
      color: #172b4d;      
    }
  }
</style>