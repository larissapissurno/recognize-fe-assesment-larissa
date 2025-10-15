class RecognitionsController < ApplicationController
  before_action :require_login

  def index
    @recognitions = Recognition.includes(:badge, :sender, :recipient).order(created_at: :desc)
    @recognition = Recognition.new
    @badges = Badge.order(:name)
    @users = User.order(:name)
  end

  def create
    @recognition = Recognition.new(recognition_params)
    @recognition.sender = current_user

    respond_to do |format|
      if @recognition.save
        format.html { redirect_to root_path, notice: "Recognition sent successfully! 🎉" }
        format.turbo_stream {
          render turbo_stream: turbo_stream.prepend(
            "recent_recognitions",
            partial: "recognitions/list_item",
            locals: { recognition: @recognition }
          )
        }
      else
        @recognitions = Recognition.includes(:badge, :sender, :recipient).order(created_at: :desc)
        @badges = Badge.order(:name)
        @users = User.order(:name)

        format.html {
          flash.now[:alert] = "Could not send recognition"
          render :index, status: :unprocessable_entity
        }
        format.turbo_stream {
          render :index, status: :unprocessable_entity
        }
      end
    end
  end

  private

  def recognition_params
    params.require(:recognition).permit(:recipient_id, :badge_id, :message)
  end
end
